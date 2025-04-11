import SockJs from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRef } from 'react';

function Chat() {

    const [chatMessage, setChatMessage] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    const [stompClient, setStompClient] = useState(null);



    useEffect(() => {

        const socket = new SockJs('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => { console.log('debug : ', str); },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("ws connected");
                client.subscribe('/sub/public', (message) => {
                    console.log(message);
                    const data = JSON.parse(message.body);
                    setChatMessage((prev) => [...prev, data.content]);
                });
            },
        })
        client.activate();
        setStompClient(client);
        getMessagesOfChatRoom();

        // 컴포넌트 언마운트 시 연결 종료
        return () => {
            client.deactivate();
        };
    }, []);

    // getMessagesOfChatRoom 함수 추가
    const getMessagesOfChatRoom = async () => {
        await axios({
            url : 'http://localhost:8080/chats/chatMessages',
            method : 'GET',
            headers : {}
        }).then((res) => {
            console.log(res.data);
            console.log('response content : ' , res.data)
            setChatMessage( res.data.map((message) => message.content)); 
        }).catch((err) => {
            console.error(err);
        });
    }


    // sendNewMessage 함수 추가
    const sendMessage = async () => {
        if (stompClient) { // && input.trim() !== ''
            const chatMessage = {
                sender: 'User', // 실제 사용자 정보 적용 가능
                content: inputMessage, // input
                type: 'CHAT'
            };
            await stompClient.publish({
                destination: '/pub/chat.sendMessage',
                body: JSON.stringify(chatMessage)
            });
              setInputMessage('');
            console.log("send Message : ", chatMessage);
        }

        
    };

    const changeInputMessage = (e) => {
        setInputMessage(e.target.value);
    }

    return (

        <div>
            <h1>Chat</h1>
            <input type="text" value={inputMessage} onChange={changeInputMessage} />
            <button onClick={sendMessage} >senMessage</button>
            {chatMessage.length > 0 && chatMessage.map((message, index) => (
                <div key={index}> {message} </div>
            ))}
        </div>
    )
}

export default Chat
