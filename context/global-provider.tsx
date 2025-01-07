import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useAudioPlayer, AudioPlayer } from "expo-audio";


interface GlobalContextType {
    audioUrl: string | null;
    setAudioUrl: React.Dispatch<React.SetStateAction<string | null>>;
    imageUrl: string | null;
    setImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
    lyrics: string | null;
    setLyrics: React.Dispatch<React.SetStateAction<string | null>>;
    audioPlayer: AudioPlayer | null;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    togglePlayPause: () => Promise<void>;
    duration: number;
    position: number;
    handleSeek: (value: number) => Promise<void>;
};

interface GlobalProviderProps {
    children: ReactNode;
  }


const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalProvider");
    }
    return context;
};

const GlobalProvider = ({ children }: GlobalProviderProps) => {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [lyrics, setLyrics] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);

    const audioPlayer = useAudioPlayer(audioUrl || "");

    useEffect(() => {
        const setupListener = () => {
            try {
                if (audioPlayer) {
                    const playbackListener = (status: any) => {
                        if (status.isLoaded) {
                            setDuration(status.duration || 0);
                            setPosition(status.currentTime || 0);
                            setIsPlaying(status.playing || false);
                        }
                    };
    
                    audioPlayer.addListener("playbackStatusUpdate", playbackListener);
    
                    // Return the cleanup function to remove the listener when the component unmounts or audioPlayer changes
                    return () => {
                        if (audioPlayer?.removeListener) {
                            audioPlayer.removeListener("playbackStatusUpdate", playbackListener);
                        }
                    };
                }
            } catch (error) {
                console.error("Error setting up audioPlayer listener:", error);
            }
        };
    
        const cleanupListener = setupListener();
    
        return () => {
            if (cleanupListener) {
                cleanupListener();
            }
        };
    }, [audioPlayer]);

    useEffect(() => {
        console.log('audioUrl updated:', audioUrl);
        console.log('image updated:', imageUrl);
        console.log('lyrics updated:', lyrics);
    }, [audioUrl, imageUrl, lyrics]);

    const togglePlayPause = async () => {
        if (!audioPlayer) return; 
    
        try {
            if (isPlaying) {
                await audioPlayer.pause();
                setIsPlaying(false);
            } else {
                await audioPlayer.play();
                setIsPlaying(true); 
            }
        } catch (error) {
            console.error("Error toggling play/pause:", error);
        }
    };

    const handleSeek = async (value: number) => {
        if (audioPlayer) {
            const seekPosition = Math.floor(value * duration);
            await audioPlayer.seekTo(seekPosition);
        }
    };

    // Avoid unnecessary re-renders by memoizing like formatTime and context values in the GlobalProvider....
    const contextValue = useMemo(
        () => ({
            audioUrl,
            setAudioUrl,
            imageUrl,
            setImageUrl,
            lyrics,
            setLyrics,
            audioPlayer,
            isPlaying,
            setIsPlaying,
            togglePlayPause,
            duration,
            position,
            handleSeek,
        }),
        [audioUrl, imageUrl, lyrics, audioPlayer, isPlaying, duration, position]
    );

    return (
    <GlobalContext.Provider 
        value={ contextValue }
    >
        {children}
    </GlobalContext.Provider>
    )
}

export default GlobalProvider;