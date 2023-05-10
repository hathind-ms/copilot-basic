// Copyright (c) Microsoft. All rights reserved.
import { Avatar, Spinner, Subtitle1, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { Alert } from '@fluentui/react-components/unstable';
import { Dismiss16Regular } from '@fluentui/react-icons';
import * as React from 'react';
import { FC, useEffect } from 'react';
import BackendProbe from './components/views/BackendProbe';
import { ChatView } from './components/views/ChatView';
import { useChat } from './libs/useChat';
import { useAppDispatch, useAppSelector } from './redux/app/hooks';
import { RootState } from './redux/app/store';
import { removeAlert } from './redux/features/app/appSlice';
import { Constants } from './Constants';

const useClasses = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100vh',
    },
    content: {
        Flex: 'auto',
    },
    header: {
        backgroundColor: '#9c2153',
        width: '100%',
        height: '5.5%',
        color: '#FFF',
        display: 'flex',
        '& h1': {
            paddingLeft: '20px',
            display: 'flex',
        },
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    persona: {
        marginRight: '20px',
    },
    cornerItems: {
        display: 'flex',
        ...shorthands.gap(tokens.spacingHorizontalXS),
    },
});

enum AppState {
    ProbeForBackend,
    LoadingChats,
    Chat,
}

const App: FC = () => {
    const classes = useClasses();

    const [appState, setAppState] = React.useState(AppState.ProbeForBackend);
    const { alerts } = useAppSelector((state: RootState) => state.app);
    const dispatch = useAppDispatch();

    const chat = useChat();

    useEffect(() => {
        async function loadChats() {
            if (await chat.loadChats()) {
                setAppState(AppState.Chat);
            }
        }

        loadChats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appState]);

    const onDismissAlert = (key: string) => {
        dispatch(removeAlert(key));
    };

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <Subtitle1 as="h1">Copilot Chat</Subtitle1>
                <div className={classes.cornerItems}>
                    <Avatar
                        className={classes.persona}
                        key={Constants.guestUser.id}
                        name={Constants.guestUser.name}
                        size={28}
                        badge={{ status: 'available' }}
                    />
                </div>
            </div>
            <div className={classes.content}>
                {alerts &&
                    Object.keys(alerts).map((key) => {
                        const alert = alerts[key];
                        return (
                            <Alert
                                intent={alert.type}
                                action={{
                                    icon: (
                                        <Dismiss16Regular
                                            aria-label="dismiss message"
                                            onClick={() => onDismissAlert(key)}
                                            color="black"
                                        />
                                    ),
                                }}
                                key={key}
                            >
                                {alert.message}
                            </Alert>
                        );
                    })}
                {appState === AppState.ProbeForBackend && (
                    <BackendProbe
                        uri={Constants.backendUrl as string}
                        onBackendFound={() => setAppState(AppState.LoadingChats)}
                    />
                )}
                {appState === AppState.LoadingChats && <Spinner labelPosition="below" label="Loading Chats" />}
                {appState === AppState.Chat && <ChatView />}
            </div>
        </div>
    );
};

export default App;
