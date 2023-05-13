// Copyright (c) Microsoft. All rights reserved.

import { IChatMessage } from '../models/ChatMessage';
import { IChatSession } from '../models/ChatSession';
import { BaseService } from './BaseService';

export class ChatService extends BaseService {
    public createChatAsync = async (userId: string, userName: string, title: string): Promise<IChatSession> => {
        const body = {
            userId: userId,
            userName: userName,
            title: title,
        };

        const result = await this.getResponseAsync<IChatSession>({
            commandPath: 'chatSession/create',
            method: 'POST',
            body: body,
        });

        return result;
    };

    public getChatMessagesAsync = async (chatId: string, startIdx: number, count: number): Promise<IChatMessage[]> => {
        const result = await this.getResponseAsync<IChatMessage[]>({
            commandPath: `chatSession/getChatMessages/${chatId}?startIdx=${startIdx}&count=${count}`,
            method: 'GET',
        });

        return result;
    };

    public editChatAsync = async (chatId: string, title: string): Promise<any> => {
        const body: IChatSession = {
            id: chatId,
            userId: '',
            title: title,
        };

        const result = await this.getResponseAsync<any>({
            commandPath: `chatSession/edit`,
            method: 'POST',
            body: body,
        });

        return result;
    };
}
