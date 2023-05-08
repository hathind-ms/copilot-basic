import { Constants } from '../Constants';
import { useAppDispatch, useAppSelector } from '../redux/app/hooks';
import { RootState } from '../redux/app/store';
import { addAlert } from '../redux/features/app/appSlice';
import { ChatState } from '../redux/features/conversations/ChatState';
import {
    addConversation,
    incrementBotProfilePictureIndex,
    setSelectedConversation,
    updateConversation,
} from '../redux/features/conversations/conversationsSlice';
import { AlertType } from './models/AlertType';
import { AuthorRoles } from './models/ChatMessage';
import { IChatSession } from './models/ChatSession';
import { ChatUser } from './models/ChatUser';
import { useSemanticKernel } from './semantic-kernel/useSemanticKernel';
import { ChatService } from './services/ChatService';

export const useChat = () => {
    const dispatch = useAppDispatch();
    const sk = useSemanticKernel(process.env.REACT_APP_BACKEND_URI as string);
    const { botProfilePictureIndex } = useAppSelector((state: RootState) => state.conversations);

    const chatService = new ChatService(process.env.REACT_APP_BACKEND_URI as string);

    const botProfilePictures: string[] = [
        '/assets/bot-icon-1.png',
        '/assets/bot-icon-2.png',
        '/assets/bot-icon-3.png',
        '/assets/bot-icon-4.png',
        '/assets/bot-icon-5.png',
    ];

    const loggedInUser: ChatUser = {
        id: Constants.GuestUser.id,
        fullName: Constants.GuestUser.name,
        emailAddress: Constants.GuestUser.email,
        photo: undefined,
        online: true,
        lastTypingTimestamp: 0,
    };

    const getAudienceMemberForId = (id: string, chatId: string, audience: ChatUser[]) => {
        if (id === `${chatId}-bot` || id.toLocaleLowerCase() === 'bot') return Constants.bot.profile;
        return audience.find((member) => member.id === id);
    };

    const createChat = async () => {
        const chatTitle = `Copilot`;
        try {
            await chatService
                .createChatAsync('guest-user-id', 'guest-user-name', chatTitle)
                .then(async (result: IChatSession) => {
                    const chatMessages = await chatService.getChatMessagesAsync(result.id, 0, 1);

                    const newChat: ChatState = {
                        id: result.id,
                        title: result.title,
                        messages: chatMessages,
                        audience: [loggedInUser],
                        botTypingTimestamp: 0,
                        botProfilePicture: botProfilePictures.at(botProfilePictureIndex) ?? '/assets/bot-icon-1.png',
                    };

                    dispatch(incrementBotProfilePictureIndex());
                    dispatch(addConversation(newChat));
                    dispatch(setSelectedConversation(newChat.id));

                    return newChat.id;
                });
        } catch (e: any) {
            const errorMessage = `Unable to create new chat. Details: ${e.message ?? e}`;
            dispatch(addAlert({ message: errorMessage, type: AlertType.Error }));
        }
    };

    const getResponse = async (value: string, chatId: string) => {
        const ask = {
            input: value,
            variables: [
                {
                    key: 'userId',
                    value: Constants.GuestUser.id,
                },
                {
                    key: 'userName',
                    value: Constants.GuestUser.name,
                },
                {
                    key: 'chatId',
                    value: chatId,
                },
            ],
        };

        try {
            var result = await sk.invokeAsync(ask, 'ChatSkill', 'Chat');

            const messageResult = {
                timestamp: new Date().getTime(),
                userName: 'bot',
                userId: 'bot',
                content: result.value,
                authorRole: AuthorRoles.Bot,
            };

            dispatch(updateConversation({ message: messageResult, chatId: chatId }));
        } catch (e: any) {
            const errorMessage = `Unable to generate bot response. Details: ${e.message ?? e}`;
            dispatch(addAlert({ message: errorMessage, type: AlertType.Error }));
        }
    };

    const loadChats = async () => {
        try {
            await createChat();
            return true;
        } catch (e: any) {
            const errorMessage = `Unable to load chats. Details: ${e.message ?? e}`;
            dispatch(addAlert({ message: errorMessage, type: AlertType.Error }));

            return false;
        }
    };

    return {
        getAudienceMemberForId,
        createChat,
        loadChats,
        getResponse,
    };
};
