// Copyright (c) Microsoft. All rights reserved.

import { Bot } from '../models/Bot';
import { BaseService } from './BaseService';

export class BotService extends BaseService {
    public downloadAsync = async (chatId: string, userId: string): Promise<any> => {
        const result = await this.getResponseAsync<any>({
            commandPath: `bot/download/${chatId}/${userId}`,
            method: 'GET',
        });

        return result;
    };

    public uploadAsync = async (bot: Bot, userId: string): Promise<any> => {
        // TODO: return type
        const result = await this.getResponseAsync<any>({
            commandPath: `bot/upload?userId=${userId}`,
            method: 'Post',
            body: bot,
        });

        return result;
    };
}
