import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Player from "./components/Player";
import Chat from "./components/Chat";
import { enqueue } from "./redux/radioSlice";
import "./styles.css";

export default function App() {
  const dispatch = useDispatch();

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
      <h1>guerrinha</h1>
      <Player />
      <hr />
      <Chat />
    </div>
  );
}
