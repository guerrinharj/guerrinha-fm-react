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

        return () => socket.close();
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

        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ username: trimmedUser, message: trimmedMsg }));
        setMessage("");
        } else {
            console.warn("WebSocket not open yet.");
        }
    };

    return (
        <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column" }}>
        <div
            ref={chatBoxRef}
            style={{
            flex: 1,
            overflowY: "auto",
            padding: "1em",
            paddingBottom: "5em", // leave space so bottom messages aren't hidden
            width: "100%",
            textAlign: "left"
            }}
        >
            {messages.map((msg, i) => (
                <p key={i}><strong>{msg.username}:</strong> {msg.message}</p>
            ))}
        </div>

        {/* Fixed input bar */}
        <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            gap: "0.5em",
            backgroundColor: "black",
            padding: "1em",
            borderTop: "1px solid white"
        }}>
            <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your name"
            style={{
                padding: "0.5em",
                width: "20%",
                backgroundColor: "black",
                color: "white",
                border: "1px solid white"
            }}
            />
            <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="your message"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            style={{
                padding: "0.5em",
                width: "60%",
                backgroundColor: "black",
                color: "white",
                border: "1px solid white"
            }}
            />
            <button onClick={sendMessage} style={{
            backgroundColor: "black",
            color: "white",
            border: "1px solid white",
            padding: "0.5em 1em",
            cursor: "pointer"
            }}>
            send
            </button>
        </div>
        </div>
    );
}
