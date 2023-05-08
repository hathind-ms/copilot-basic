// Copyright (c) Microsoft. All rights reserved.

import { BaseService } from '../services/BaseService';
import { IAsk } from './model/Ask';
import { IAskResult } from './model/AskResult';

export class SemanticKernel extends BaseService {
    public invokeAsync = async (
        ask: IAsk,
        skillName: string,
        functionName: string,
    ): Promise<IAskResult> => {
        // If skill requires any additional api properties, append to context

        const result = await this.getResponseAsync<IAskResult>(
            {
                commandPath: `skills/${skillName}/functions/${functionName}/invoke`,
                method: 'POST',
                body: ask,
            },
        );

        return result;
    };
}
