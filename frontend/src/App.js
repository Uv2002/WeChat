import React, { useContext } from 'react';
import {  Route, Routes,Link, redirect } from 'react-router-dom';
import Register from './Registration.js';
import Login from './Login.js';
import Home from './Home.js';
import Landing from './Landing.js';
import {AuthContext} from './context/AuthProvider.js';
import CreateChannel from './create_channel.js';
import SearchOption from './SearchOption.js';


function App() {
  const { auth } = useContext(AuthContext);
  
  return (
    <main>
      <Routes>
        <Route path="/" element={<Landing/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/home" element={auth.accessToken?<Home/>:<Login/>}></Route>
        <Route path="/register" element= {< Register/ >}></Route>
        <Route path="/create_channel" element={auth.accessToken?<CreateChannel/>:<Login/>}></Route>
        <Route path="/more_search_options" element={auth.accessToken?<SearchOption/>:<Login/>}></Route>
    
        {/* <Route path="/landing" element={<Landing/>}></Route> */}
        
            {/* <Route path="/login" element={<Login/>} /> */}
            {/* <Route path="/register" element={<Register/>} /> */}
      </Routes>
      </main>
      
      
  );
}

export default App;