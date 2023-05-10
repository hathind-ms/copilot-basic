export const Constants = {
    backendUrl: process.env.REACT_APP_BACKEND_URI ?? 'https://localhost:40443/',
    guestUser: {
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
