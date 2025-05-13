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
            .catch((err) => {
                console.error("Audio play failed", err);
                dispatch(setPlaying(false));
            });

        const handleEnded = () => {
            dispatch(setPlaying(false));
            dispatch(playNext());
        };

        player.addEventListener("ended", handleEnded);
        return () => player.removeEventListener("ended", handleEnded);
    }, [currentTrack, isMuted, dispatch]);

    return (
        <>
            <pre>{isPlaying ? "online!" : "connecting..."}</pre>
            <h3>now playing:</h3>

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


            <p>
                <span>"{currentTrack?.name || "waiting..."}"</span>
            </p>

            {currentTrack?.album_url ? (
                <p>
                    <span>
                        <a
                            href={currentTrack.album_url}
                            style={{
                                textDecoration: "underline",
                                color: "inherit"
                            }}
                        >
                            {currentTrack.album}
                        </a>
                    </span>
                </p>
            ) : (
                <p><span>waiting for album...</span></p>
            )}

            <p>
                <span>{currentTrack?.year || "waiting..."}</span>
            </p>

        <div style={{ marginTop: "1em" }}>
            <button
                onClick={() => dispatch(setMuted(false))}
                style={{
                    font: "inherit",
                    background: "none",
                    border: "none",
                    color: "white",
                    textDecoration: "underline",
                    cursor: "pointer",
                    marginRight: "1em"
                }}
            >
                play
            </button>
            <button
                onClick={() => dispatch(setMuted(true))}
                style={{
                    font: "inherit",
                    background: "none",
                    border: "none",
                    color: "white",
                    textDecoration: "underline",
                    cursor: "pointer"
                }}
            >
                stop
            </button>
        </div>


            <audio ref={playerRef} autoPlay />
        </>
    );
}
