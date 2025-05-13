import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Player from "./components/Player";
import Chat from "./components/Chat";
import { enqueue } from "./redux/radioSlice";
import "./styles.css";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 🎵 RADIO SOCKET SETUP
    const radioSocket = new WebSocket("ws://localhost:8000/ws/radio/");
    const startingTrack = {
      name: 'Suspenso Pelo Ciclo Implicito',
      url: "https://storage.googleapis.com/gpgc-api-bucket/RELEASED/GUERRINHA/Suspenso%20Pelo%20Ciclo%20Impli%CC%81cito/Guerrinha%20-%20Suspenso%20Pelo%20Ciclo%20Impli%CC%81cito%20-%2001%20Suspenso%20Pelo%20Ciclo%20Impli%CC%81cito.mp3"
    };

    dispatch(enqueue(startingTrack));

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
