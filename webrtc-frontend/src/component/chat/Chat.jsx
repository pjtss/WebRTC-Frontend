import SockJs from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import React, { useEffect, useState } from 'react';

function Chat() {

    const [chatMessage, setChatMessage] = useState([]);

    useEffect   ( () => {

    const socket = new SockJs('http://localhost:8080/ws'); 
    const stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => { console.log(str); },
        reconnectDelay: 5000,
        onConnect: () => {
            console.log("connected");
            stompClient.subscribe('ws://localhost:8080/sub', (message) => {
                console.log(message);
                const data = JSON.parse(message.body);
                setChatMessage((prev) => [...prev, data.content]);
            });
        },
    })
    stompClient.activate();

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
        stompClient.deactivate();
    };
    }, []);


    return (

        <div>
            <h1>Chat</h1>
        </div>
    )
}

export default Chat
