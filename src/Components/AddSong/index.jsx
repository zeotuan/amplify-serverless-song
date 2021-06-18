import React,{useState} from 'react';
import {API, Storage} from 'aws-amplify';
import {createSong} from '../../graphql/mutations';
import {IconButton, TextField} from '@material-ui/core';
import UploadIcon from '@material-ui/icons/Publish'
import {v4 as uuid} from 'uuid';
const AddSong = ({onUpload}) => {
    const [songData,setSongData] = useState({});
    const [mp3Data,setMp3Data] = useState();
    const handleChange = (e) => {
      setSongData((prevSongData) => ({...prevSongData, [e.target.name]:e.target.value}))
    }
  
    const upload = async () => {
      try{
        const {key} = await Storage.put(`${uuid()}-${songData.title}.mp3`,mp3Data,{contentType:'audio/mp3'});
        const createSongInput = {
          id:uuid(),
          title:songData.title,
          owner:songData.owner,
          description:songData.description,
          filePath:key,
          likes:0
        }
        await API.graphql({
          query: createSong,
          variables: {input:createSongInput},
          authMode:"AWS_IAM"
        })
        await onUpload();
      }catch(error){
        console.log("upload song error:", error);
      }
      
    }
    return(
      <div className="newSong">
        <TextField label="Title" name="title" value={songData.title} onChange={(e)=>handleChange(e)}/>
        <TextField label="Artist" name="owner" value={songData.owner} onChange={(e)=>handleChange(e)}/>
        <TextField label="Description" name="description" value={songData.description} onChange={(e)=>handleChange(e)}/>
        <input type="file" accept="audio/mp3" onChange={(e) => setMp3Data(e.target.files[0])}></input>
        <IconButton aria-label="upload audio" onClick={upload}>
          <UploadIcon />
        </IconButton>
      </div>
    )
  }
  
  export default AddSong;