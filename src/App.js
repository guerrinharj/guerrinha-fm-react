import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Player from "./components/Player";
import Chat from "./components/Chat";
import { enqueue } from "./redux/radioSlice";
import "./styles.css";

export default function App() {
  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.radio.isPlaying);

  useEffect(() => {
    const radioSocket = new WebSocket("ws://localhost:8000/ws/radio/");

    radioSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.track?.url) {
        dispatch(enqueue(data.track));
      }
    };

    return () => radioSocket.close();
  }, [dispatch]);

  return (
    <div className="container">
      <div className="layout">
        <div className="chat-section">
          <Chat />
        </div>
        <div className="player-section">
          <div style={{
            paddingBottom: "0.5em",
            margin: "2em"
          }}>
            <h1 style={{ margin: 0 }}>Guerrinha</h1>
            <pre style={{ margin: 0 }}>{isPlaying ? "online" : "connecting..."}</pre>
          </div>
          <Player />
        </div>
      </div>
    </div>
  );
}
