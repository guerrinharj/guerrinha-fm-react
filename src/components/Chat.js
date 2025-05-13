import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../redux/chatSlice";

export default function Chat() {
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.chat.messages);

    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const chatBoxRef = useRef(null);
    const chatSocketRef = useRef(null);

    useEffect(() => {
        const socket = new WebSocket("wss://guerrinha-fm.onrender.com/ws/chat/");
        chatSocketRef.current = socket;

        socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
            dispatch(addMessage(data));
        };

        return () => {
            socket.close();
        };
    }, [dispatch]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

        const sendMessage = () => {
            const trimmedUser = username.trim();
            const trimmedMsg = message.trim();
            const socket = chatSocketRef.current;
        
            if (!trimmedUser || !trimmedMsg || !socket) return;
        
            // Only send if WebSocket is ready
            if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                username: trimmedUser,
                message: trimmedMsg
            }));
            setMessage("");
            } else {
                console.warn("WebSocket not open yet.");
            }
        };      

    return (
        <div>
        <h3>chat</h3>
        <div
            id="chat-box"
            ref={chatBoxRef}
            style={{
            maxHeight: "200px",
            overflowY: "auto",
            border: "1px solid white",
            padding: "1em",
            margin: "1em auto",
            width: "80%",
            textAlign: "left"
            }}
        >
            {messages.map((msg, i) => (
            <p key={i}><strong>{msg.username}:</strong> {msg.message}</p>
            ))}
        </div>

        <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your name"
            style={{ padding: "0.5em", width: "20%" }}
        />
        <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="your message"
            style={{ padding: "0.5em", width: "50%" }}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>send</button>
        </div>
    );
}
