import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../redux/chatSlice";

// 7 rainbow colors
const RAINBOW_COLORS = [
    "#FF0000", // Red
    "#FF7F00", // Orange
    "#FFFF00", // Yellow
    "#00FF00", // Green
    "#0000FF", // Blue
    "#4B0082", // Indigo
    "#8B00FF"  // Violet
];

// Simple hash function to deterministically pick a color index
function getUsernameColor(username) {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return RAINBOW_COLORS[Math.abs(hash) % RAINBOW_COLORS.length];
}

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
            chatBoxRef.current.scrollTop = 0; // scroll to top (newest message first)
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
                    overflowY: "scroll",
                    overflowX: "hidden",
                    paddingLeft: "1em",
                    paddingBottom: "5em",
                    width: "100%",
                    textAlign: "left",
                    scrollbarWidth: "none",            // Firefox
                    msOverflowStyle: "none"            // IE and Edge
                }}
            >
                {[...messages].reverse().map((msg, i) => (
                    <p key={i}>
                        <strong style={{ color: getUsernameColor(msg.username) }}>
                            {msg.username}:
                        </strong>{" "}
                        {msg.message}
                    </p>
                ))}
            </div>

            <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                display: "flex",
                gap: "0.5em",
                backgroundColor: "black",
                padding: "1em",
                borderTop: "1px solid white",
                width: "100%"
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
                        border: "none",
                        font: 'inherit'
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
                        border: "none",
                        font: 'inherit'
                    }}
                />
                <button onClick={sendMessage} style={{
                    backgroundColor: "black",
                    color: "white",
                    border: "none",
                    padding: "0.5em 1em",
                    cursor: "pointer",
                    font: 'inherit'
                }}>
                    send
                </button>
            </div>
        </div>
    );
}
