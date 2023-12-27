import React, { useContext, useState, useEffect } from 'react';
import {AuthContext} from "./context/AuthProvider.js";
import axios from './api_proxy/axios.js';



const SearchOption = () => {
    const { auth,setAuth } = useContext(AuthContext);
    const [minUsername, setMinUsername] = useState(null);
    const [maxUsername, setMaxUsername] = useState(null);

    const [userSearchName,setUserSearchName] = useState("");
    const [userPosts,setUserPosts] = useState([]);


    function changeUserSearchName(event){
        setUserSearchName(event.target.value);
    }

    async function searchUserPosts(){
        try {
            const response = await axios.get('api/posts/search_user'+"/"+userSearchName,{headers:{'Authorization':'Bearer '+auth.accessToken}});
            if(response.status == 200){
                if(response.data.status=="success"){
                    const { data } = response.data;

                    setUserPosts(data)
                }
                else{
                    console.log("request failed: "+response.data.message);
                }
            }
            
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        
    }
    


  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('api/posts/most_least_post',{headers:{'Authorization':'Bearer '+auth.accessToken}});
          const { data } = response.data;
          setMinUsername(data[0].min);
          setMaxUsername(data[0].max);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);

    return (
        <div>
          <h2>Username with Minimum posts Occurrences: {minUsername}</h2>
          <h2>Username with Maximum posts Occurrences: {maxUsername}</h2>
          <input type='text' onChange={changeUserSearchName} value={userSearchName} placeholder='User Search' />
          <button onClick={searchUserPosts} >Find all Posts</button>
        <p>All user Posts</p>
          {userPosts.map((Element)=>{
            return <p>{Element.content}</p>;
          })}
        </div>
      );
};

export default SearchOption;
