import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { playNext, setPlaying, setMuted } from "../redux/radioSlice";

export default function Player() {
    const playerRef = useRef(null);
    const dispatch = useDispatch();
    const { currentTrack, isMuted, queue } = useSelector((state) => state.radio);

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
        <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", width: "100%" }}>
            {/* MAIN CONTENT */}
            <div style={{ flex: 1, padding: "1em", paddingBottom: "5em" }}>
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
                                target="_blank"
                                rel="noopener noreferrer"
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

                <audio ref={playerRef} autoPlay />
            </div>

            {/* CONTROL BAR */}
            <div style={{
                backgroundColor: "black",
                borderTop: "1px solid white",
                padding: "1em",
                display: "flex",
                justifyContent: "center",
                gap: "1em",
                width: "100%",
                position: "absolute",
                bottom: "0"
            }}>
                <button
                    onClick={() => dispatch(setMuted(false))}
                    style={{
                        backgroundColor: "black",
                        color: "white",
                        border: "none",
                        padding: "0.5em 1em",
                        cursor: "pointer",
                        font: 'inherit'
                    }}
                >
                    play
                </button>
                <button
                    onClick={() => dispatch(setMuted(true))}
                    style={{
                        backgroundColor: "black",
                        color: "white",
                        border: "none",
                        padding: "0.5em 1em",
                        cursor: "pointer",
                        font: 'inherit'
                    }}
                >
                    stop
                </button>
            </div>
        </div>
    );
}
