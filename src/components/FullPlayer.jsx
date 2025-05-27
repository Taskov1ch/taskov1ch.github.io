import React, { useContext } from 'react';
 import { PlayerContext } from '../context/PlayerContext';
 import '../assets/styles/Player.css';

 const FullPlayer = () => {
   const {
     playlist,
     currentSongIndex,
     selectSong,
     isPlayerVisible,
     setIsPlayerVisible,
     currentSong,
   } = useContext(PlayerContext);

   if (!isPlayerVisible) return null;

   return (
     <div className="full-player-overlay" onClick={() => setIsPlayerVisible(false)}>
       <div className="full-player-content" onClick={(e) => e.stopPropagation()}>
         <h2>Плейлист</h2>
         <img src={currentSong?.albumArt || '/music/default.png'} alt="Album Art" className="full-player-art"/>
         <h3>{currentSong?.title}</h3>
         <p>{currentSong?.artist}</p>
         <ul>
           {playlist.map((song, index) => (
             <li
               key={index}
               className={index === currentSongIndex ? 'active-song' : ''}
               onClick={() => selectSong(index)}
             >
               {song.title} - {song.artist}
             </li>
           ))}
         </ul>
         <button className="close-button" onClick={() => setIsPlayerVisible(false)}>Закрыть</button>
       </div>
     </div>
   );
 };

 export default FullPlayer;