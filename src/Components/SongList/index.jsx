import React,{useState, useEffect} from 'react';
import {Paper, IconButton} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FavouriteIcon from '@material-ui/icons/Favorite';
import PauseIcon from '@material-ui/icons/Pause';
import {API, Storage} from 'aws-amplify';
import { listSongs } from '../../graphql/queries';
import {updateSong} from '../../graphql/mutations';
import AddIcon from '@material-ui/icons/Add';
import AddSong from '../AddSong';
const SongList = ({setAudio}) => {
    const [songs,setSongs] = useState([]);
    const [songPlaying, setSongPlaying] = useState('');
    const [showAddSong, setShowAddSong] = useState(false);

    const toggleSong = async (id,filePath="") => {
      if(songPlaying === id){
        setSongPlaying('');
        return;
      } 
      try{
        const fileAccessUrl = await Storage.get(filePath,{expires:60});
        console.log('access url:' , fileAccessUrl);
        setSongPlaying(id);
        setAudio(fileAccessUrl);
      }catch(error){
        console.log("toggle song error", error);
        setSongPlaying('');
        setAudio('');
      }
    }

    useEffect(()=>{
        fetchSongs();
      },[]);

      const fetchSongs = async () => {
        try{
          const songData = await API.graphql({
            query:listSongs,
            authMode:'AWS_IAM'
          });  
          const songLists = songData.data.listSongs.items;
          setSongs(songLists);
          console.log("song lists: ", songs);
    
        }catch(error){
          console.log("fetch songs error:",error);
        }
      }
    
      const uploadSong = async () => {
        try{
          setShowAddSong(false);
          await fetchSongs();
        }catch(error){
          console.log("upload song errors:", error);
        }
      }
    
      const addLike = async (song) => {
        try{ 
          const songToLike = song;
          songToLike.likes = songToLike.likes + 1;
          delete songToLike.createdAt;
          delete songToLike.updatedAt;
          const likedSong = await API.graphql({
            query: updateSong,
            variables: {input:songToLike},
            authMode:"AWS_IAM"
          });
          setSongs(songs.map(song=>song.id !== likedSong.id? song : likedSong));
        }catch(error){
          console.log("adding likes error:" ,error)
        }
      }
    

    return(
        <div className="songList">
        {songs.map(song => (
            <Paper key={song.id} variant="outlined" elevation={2}>
              <div className="songCard">
                <IconButton aria-label="play" onClick={()=>{toggleSong(song.id, song.filePath)}}>
                  {songPlaying === song.id ? <PauseIcon />:<PlayArrowIcon />}
                </IconButton>
                <div>
                  <div className="songTitle">{song.title}</div>
                  <div className="songOwner">{song.owner}</div>
                </div>
                <div>
                  <IconButton aria-label="like" onClick={()=>{addLike(song)}}>
                    <FavouriteIcon />
                  </IconButton>
                  {song.likes}
                </div>
                <div className="songDescription">{song.description}</div>
                
              </div>
            </Paper>
        ))}
        {
        showAddSong ? 
        <AddSong onUpload={uploadSong}/> 
        : <IconButton aria-label="upload audio" onClick={()=>{setShowAddSong(true)}}>
            <AddIcon />
          </IconButton>
        }
      </div>
      
    )
}


export default SongList;
