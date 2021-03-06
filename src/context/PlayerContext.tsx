import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    hasPrevious: boolean;
    hasNext: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    clearPlayerState: () => void;
    toggleMenuPlay: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData);


type  PlayerContextProviderProps={
    children: ReactNode;
}

export function PlayerContextProvider({children}: PlayerContextProviderProps){

    const [episodeList, setEpisodelist] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);


    function play(episode: Episode){
        setEpisodelist([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Episode[], index: number){
        setEpisodelist(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay(){
        setIsPlaying(!isPlaying);
    }

    function toggleLoop(){
        setIsLooping(!isLooping);
    }

    function toggleShuffle(){
        setIsShuffling(!isShuffling);
    }

    function setPlayingState(state: boolean){
        setIsPlaying(state);
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

    function playNext(){
        if(isShuffling){
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        } 
        else if(hasNext){
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }

    }


    function clearPlayerState(){
        setEpisodelist([]);
        setCurrentEpisodeIndex(0);
    }

    function playPrevious(){
        if(hasPrevious){
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)

        }
    }

    function toggleMenuPlay(){
        setShowPlayer(!showPlayer);
    }


    return (
    <PlayerContext.Provider value={{ 
        episodeList, 
        currentEpisodeIndex, 
        hasPrevious,
        hasNext,
        isPlaying, 
        isLooping,
        isShuffling,
        play, 
        togglePlay, 
        setPlayingState,
        playList,
        playNext,
        playPrevious,
        toggleLoop,
        toggleShuffle,
        clearPlayerState,
        toggleMenuPlay,
    }}>
        {children}
    </PlayerContext.Provider>
    )

}

export const usePlayer = () =>{
    return useContext(PlayerContext);
}



