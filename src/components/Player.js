import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { playNext, setPlaying, setMuted } from "../redux/radioSlice";

export default function Player() {
    const playerRef = useRef(null);
    const dispatch = useDispatch();

    const { currentTrack, isPlaying, isMuted, queue } = useSelector((state) => state.radio);

    useEffect(() => {
        if (!currentTrack && queue.length > 0) {
            dispatch(playNext());
        }
    }, [currentTrack, queue, dispatch]);

    useEffect(() => {
        const player = playerRef.current;
        if (!player || !currentTrack) return;

        const liveUrl = currentTrack.url + "?t=" + Date.now();
        player.src = liveUrl;
        player.load();
        player.muted = isMuted;

        player.play()
            .then(() => dispatch(setPlaying(true)))
            .catch(() => dispatch(setPlaying(false)));

        player.addEventListener("ended", () => {
            dispatch(setPlaying(false));
            dispatch(playNext());
        });

        return () => {
            player.removeEventListener("ended", () => {});
        };
    }, [currentTrack, isMuted, dispatch]);

    return (
        <>
            <pre>{isPlaying ? "" : "connecting..."}</pre>
            <h3>now playing:</h3>
            <p><span>"{currentTrack?.name || "waiting for data..."}"</span></p>

            <p><span>from <a href={currentTrack.album_url}>"{currentTrack?.album || "waiting for data..."}"</a> </span></p>

            {currentTrack?.cover_url && (
                <img
                    src={currentTrack.cover_url}
                    alt="cover"
                    style={{
                        width: "100%",
                        maxWidth: "300px",
                        height: "auto",
                        marginBottom: "1em",
                        border: "1px solid grey"
                    }}
                />
            )}

            <button onClick={() => dispatch(setMuted(false))}>play</button>
            <button onClick={() => dispatch(setMuted(true))}>stop</button>
            <audio ref={playerRef} autoPlay muted />
        </>
    );
}
