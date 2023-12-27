import React, { useContext, useEffect, useState } from 'react';
import {AuthContext} from './context/AuthProvider.js';
import axios from './api_proxy/axios.js';
const CHANNELS_URL = "/api/channels/";
const POSTS_URL = "/api/posts/";
const CHANNEL_POSTS_URL = "/api/posts/channel";
const LIKE_POST = "/api/posts/like";
const DISLIKE_POST = "/api/posts/dislike";



const Home = () => {
  const { auth,setAuth } = useContext(AuthContext);
  const [channels,setChannels] = useState([]);
  const [filteredChannels,setFilteredChannels] = useState([]);
  const [posts,setPosts] = useState([]);
  const [currentChannel,setCurrentChannel] = useState(null);
 
  const [searchTerm, setSearchTerm] = useState('');
  const [postInputReference, setPostInputReference] = useState("");
  const [isLiked, setLiked] = useState("");
  const [isdisLiked, setdisLiked] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [reply, setReply] = useState(null);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      const response = await axios.post('/api/files/image_upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      let url="/api/static/images";

      if(response.status==200){
        if(response.data.status = "success"){
          url+="/"+response.data.data;
          attemptSendImagePost(url);
        }
      }



      console.log('Upload success:', response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  async function initializeChannels(){
    try {
      const channelsResponse = await axios.get(CHANNELS_URL,{headers:{'Authorization':'Bearer '+auth.accessToken}});
      if(channelsResponse.status ==200){
     
        if(channelsResponse.data.status == "success")
        {
       
          let data=channelsResponse.data.data;
          console.log(data);
          if(data.length>0){
            setCurrentChannel(data[0]);
      
          }

          setFilteredChannels(data);

          console.log("setting channel")
          setChannels(data);
        }
      }
    }
    catch(err){
      console.log(err.message);
    }
  }
  
  const handleChange = (e) => {
    console.log(e.target.value);
    setSearchTerm(e.target.value);
    setFilteredChannels(channels.filter(element=>{
      return element.name.includes(e.target.value);
    }));


  };

  function handlePostChange(e){
    setPostInputReference(e.target.value);
  }


  function showSearchOptions(){
    window.location.href="/more_search_options";
  }

  function openChannelCreatePage(){
    window.location.href="/create_channel";
   
  }

  function setCurrentChannelHandler(channel){
    setCurrentChannel(channel);

  }

  const handleThumbsUpClick = async (postId) => {
    setLiked(!isLiked);
    try{
    console.log(posts);
    await axios.patch(LIKE_POST,{postId},{headers:{'Authorization':'Bearer ' + auth.accessToken}});
    }catch(err){
      console.log(err.message);
    }
    alert("your like is reported.")
  };

  const handleThumbsdownClick = async (postId) => {
    setLiked(!isdisLiked);
  
    try{
    await axios.patch(DISLIKE_POST,{postId},{headers:{'Authorization':'Bearer ' + auth.accessToken}});
    }catch(err){
      console.log(err.message);
    }
  };


  const handleSearch = async () => {
    
    try {
      const response = await axios.get("/api/channels/search_content/" + searchTerm ,{headers:{'Authorization':'Bearer '+ auth.accessToken}});
      const searchData = response.data.data;
      console.log(searchData);
    } catch (error) {
      console.error('Error during search:', error.message);
    }
  };


  function isMe(username){
    return true;

  }

  async function attemptSendPost(e){
    console.log("attempting");
    console.log(postInputReference);
    try {
      let rep=null;
      if(reply){
        rep = reply._id;
      }
      const postResponse = await axios.post(POSTS_URL,{content:postInputReference,channelId:currentChannel._id,postType:"text",replyPost:rep},{headers:{'Authorization':'Bearer ' + auth.accessToken}});
      console.log(postResponse);
      if(postResponse.status ==200){
     
        if(postResponse.data.status == "success")
        {
          let data=postResponse.data.data;
          console.log(data);
          initializePosts();

        }

      }
    }
    catch(err){
      console.log(err.message);
    }
  }

  async function attemptSendImagePost(url){
    console.log("attempting");
    console.log(postInputReference);
    try {
      const postResponse = await axios.post(POSTS_URL,{content:url,channelId:currentChannel._id,postType:"image"},{headers:{'Authorization':'Bearer ' + auth.accessToken}});
      console.log(5);
      console.log(postResponse);
      if(postResponse.status ==200){
        // console.log(1);
        if(postResponse.data.status == "success")
        {
          let data=postResponse.data.data;
          console.log(data);
          initializePosts();

        }
      }
      

    }
    catch(err){
      console.log(err.message);
    }
  }

  async function initializePosts(){
    if(!currentChannel){
      console.log("current channel is null");
      return;
    }
    else{
      console.log("current channel "+currentChannel.name);
    }
    try {
      const channelsResponse = await axios.get(CHANNEL_POSTS_URL+"/"+currentChannel._id,{headers:{'Authorization':'Bearer '+auth.accessToken}});
      console.log(channelsResponse);
      if(channelsResponse.status ==200){
        if(channelsResponse.data.status == "success")
        {    
          let data=channelsResponse.data.data;
          console.log(data);
          setPosts(data);

        }
      }
      

    }
    catch(err){
      console.log(err.message);
    }
  }
  useEffect(()=>{
    console.log("inside use effect");
    initializeChannels();

  },[]);

  useEffect(()=>{
    console.log("inside use effect");
    initializePosts();

  },[currentChannel]);

  
  console.log(auth);
  return (
    <div className='flex w-screen h-screen bg-black'>
      <div className='flex-none w-2/5 bg-gray-900 p-10'>
        <p className='text-2xl'>Channels</p>
        <input
  type='text'
  className='input border text-black  p-2  border-black rounded bg-white'
  placeholder='Search'
  value={searchTerm}
  onChange={handleChange}
  
/>
<button onClick={showSearchOptions}>More Search Options</button><br></br>
        <button onClick={openChannelCreatePage} className='bg-gray-600'>Create Channel<i class="fa fa-plus" aria-hidden="true"></i></button>
        <div className='overflow-scroll h-4/6'>
        {filteredChannels.map((element,index)=>{
          return <button className='border border-white text-white hover:bg-gray-700 block w-4/5 scorll-hide m-2' onClick={()=>{setCurrentChannelHandler(element);}} >{element.name}</button>
        })}
        </div>
        <div className='fixed bottom-0' onClick={()=>{setAuth({})}}>
          <span className=''> Logout </span> <i class=" fa-solid fa-right-from-bracket"></i>
        </div>
      </div>
      <div className='flex-1 bg-white p-10 h-4/5 overflow-scroll'>
      <p className='text-2xl text-gray-800'>Posts</p>
      <hr/>  

      {posts.map((element,index)=>{
        
          return <div className={isMe(element.username)?'flex m-2 justify-end':'flex m-2'}>
            {element.replyPost?<p>Replied to {element.replyPost.content}</p>:<p>No Reply</p>}
            <div>
              <button onClick={()=>{setReply(element)}} >Reply</button>
            <div className='bg-gray-600 rounded p-2'>
              {element.postType == "text"?<p className='text-2xl text-white'>{element.content}</p>:<img src={element.content} /> }
                {}
              <p className='text-sm text-white'>{element.username}</p>
              <button className="thumbs-up-button text-white " onClick={()=>{handleThumbsUpClick(element._id)}}>
              <i class="fa-regular fa-thumbs-up"></i>
              </button>
              <button className="thumbs-up-button text-white " onClick={handleThumbsdownClick}>
              <i class="fa-regular fa-thumbs-down"></i>
              </button>
            </div>
            <p className='text-sm text-gray-600'>{new Date(element.timestamp).toString()}</p>
            </div>
         
          </div>
        })}
        
      <div className='fixed bottom-0 text-white'>
        {reply?<div class="w-full">
Reply to: {reply.content}
</div>:<p>None</p>}
        <div className=' flex '>
        <div className='w-32'>
          <input type="file" name="file" onChange={handleImageChange} />
          <button onClick={handleUpload}>Upload</button>
        </div>
          <input className='input  rounded w-full flex-none text-black border-black border m-5' value={postInputReference} onChange={handlePostChange} type="text" placeholder='Send Post' />
          <button className='bg-black rounded w-full p-2 m-5 text-white' onClick={attemptSendPost}>Send</button>
        </div>
      </div>
        </div>
    </div>
  );
};

export default Home;
