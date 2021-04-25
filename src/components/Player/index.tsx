import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import styles from './styles.module.scss';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player(){

    const audioRef = useRef<HTMLAudioElement>(null);


    const { episodeList, 
            currentEpisodeIndex, 
            isPlaying, 
            togglePlay,
            setPlayingState,
            playNext,
            playPrevious,
            hasPrevious,
            hasNext,
            isLooping,
            toggleLoop,
            toggleShuffle,
            isShuffling,
            clearPlayerState,
            toggleMenuPlay,
        } = usePlayer();


        useEffect(()=>{
            if(!audioRef.current){
                return;
            }
            if(isPlaying){
                audioRef.current.play();
            }else{
                audioRef.current.pause();
            }
        }, [isPlaying])

    const episode = episodeList[currentEpisodeIndex];
    const [progress, setProgress] = useState(0);


    function setupProgressListener(){
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () =>{
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }
    

    function handleSeek(amount: number){
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded(){
        if(hasNext){
            playNext()
        }
        else{
            clearPlayerState();
        }
    }

    return(
        <div className={styles.playerContainer}>
            <header>

                <img src='/playing.svg' alt='Tocando agora' />
                <strong>Tocando agora </strong>

            </header>

           { episode ? (
               <div className={styles.currentEpisode}>

                   <Image
                   width={592}
                   height={592}
                    src={episode.thumbnail}
                    objectFit='cover'
                   />
                   <strong>{episode.title}</strong>
                   <span>{episode.members}</span>

               </div>
           ) : (

                <div className={styles.emptyPlayer}>

                    <strong>Selecione um podcast para ouvir</strong>

                </div>

           )}


            <footer className={!episode && styles.empty}>

                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                       { episode ? (
                           <Slider 
                            max={episode.duration}
                            value={progress}
                            onChange={handleSeek}                          
                            trackStyle={{ background: '#04d361'}}
                            railStyle={{ background: '#9f75ff'}}
                            handleStyle={{ borderColor: '#04d361', borderWidth: 4}}
                           />
                       ) : (
                           <div className={styles.emptySlider} />
                       )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                { episode && (
                    <audio 
                        ref={audioRef}
                        src={episode.url}
                        autoPlay
                        onEnded={handleEpisodeEnded}
                        loop={isLooping}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                    />     
                )}


                <div className={styles.buttons}>
                    <button type='button' 
                    disabled={!episode || episodeList.length === 1}
                    onClick={toggleShuffle}
                    className={isShuffling ? styles.isActive : null}>
                        <img src='/shuffle.svg' alt='Embaralhar' />
                    </button>

                    <button type='button' onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src='/play-previous.svg'  alt='Tocar anterior' />
                    </button>

                    <button type='button' 
                    className={styles.playButton} 
                    disabled={!episode}
                    onClick={togglePlay}
                    >
                        {isPlaying
                            ? <img src='/pause.svg' alt='Pause' />
                            : <img src='/play.svg' alt='Tocar' />
                        }
                    </button>

                    <button type='button' onClick={playNext} disabled={!episode || !hasNext}>
                        <img src='/play-next.svg' alt='Tocar próxima' />
                    </button>

                    <button type='button' 
                    disabled={!episode}
                    onClick={toggleLoop}
                    className={isLooping ? styles.isActive : null}
                    >
                        <img src='/repeat.svg' alt='Tocar anterior' />
                    </button>
                </div>

            </footer>

        </div>
    );
}