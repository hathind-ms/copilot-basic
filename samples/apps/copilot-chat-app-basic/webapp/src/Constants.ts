export const Constants = {
    GuestUser: {
        id: 'guest-user-id',
        name: 'guest-user-name',
        email: 'guest-user-email',
    },
    app: {
        name: 'Copilot',
        updateCheckIntervalSeconds: 60 * 5,
    },
    bot: {
        profile: {
            id: 'bot',
            fullName: 'Copilot',
            emailAddress: '',
            photo: '/assets/bot-icon.png',
        },
        typingIndicatorTimeoutMs: 5000,
    },
    debug: {
        root: 'sk-chatbot',
    },
    sk: {
        service: {
            defaultDefinition: 'int',
        },
    },
};
