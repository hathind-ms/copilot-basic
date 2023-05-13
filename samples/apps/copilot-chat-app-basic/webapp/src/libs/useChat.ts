import { Constants } from '../Constants';
import { useAppDispatch } from '../redux/app/hooks';
import { addAlert } from '../redux/features/app/appSlice';
import { ChatState } from '../redux/features/conversations/ChatState';
import {
    addConversation,
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
    const sk = useSemanticKernel(Constants.backendUrl as string);

    const chatService = new ChatService(Constants.backendUrl as string);

    const loggedInUser: ChatUser = {
        id: Constants.guestUser.id,
        fullName: Constants.guestUser.name,
        emailAddress: Constants.guestUser.email,
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
                .createChatAsync(Constants.guestUser.id, Constants.guestUser.name, chatTitle)
                .then(async (result: IChatSession) => {
                    const chatMessages = await chatService.getChatMessagesAsync(result.id, 0, 100);
                    // Messages are returned with most recent message at index 0 and oldest message at the last index,
                    // so we need to reverse the order for render
                    const orderedMessages = chatMessages.reverse();

                    const newChat: ChatState = {
                        id: result.id,
                        title: result.title,
                        messages: orderedMessages,
                        audience: [loggedInUser],
                        botTypingTimestamp: 0,
                        botProfilePicture: '/assets/bot-icon.png',
                    };

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
                    value: Constants.guestUser.id,
                },
                {
                    key: 'userName',
                    value: Constants.guestUser.name,
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
