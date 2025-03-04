export const Constants = {
    app: {
        name: 'Copilot',
        updateCheckIntervalSeconds: 60 * 5,
    },
    msal: {
        method: 'redirect', // 'redirect' | 'popup'
        auth: {
            clientId: process.env.REACT_APP_AAD_CLIENT_ID as string,
            authority: process.env.REACT_APP_AAD_AUTHORITY as string,
        },
        cache: {
            cacheLocation: 'localStorage',
            storeAuthStateInCookie: false,
        },
        skScopes: ['openid', 'offline_access', 'profile'],
    },
    bot: {
        profile: {
            id: 'bot',
            fullName: 'Copilot',
            emailAddress: '',
            photo: '/assets/bot-icon-1.png',
        },
        fileExtension: 'skcb',
        typingIndicatorTimeoutMs: 5000,
    },
    debug: {
        root: 'sk-chatbot',
    },
    sk: {
        service: {
            defaultDefinition: 'int',
        },
        // Reserved context variable names
        reservedWords: ['INPUT', 'server_url', 'server-url'],
    },
    // For a list of Microsoft Graph permissions, see https://learn.microsoft.com/en-us/graph/permissions-reference.
    // Your application registration will need to be granted these permissions in Azure Active Directory.
    msGraphScopes: ['Calendars.Read', 'Mail.Read', 'Tasks.ReadWrite', 'User.Read'],
    adoScopes: ['vso.work'],
};
