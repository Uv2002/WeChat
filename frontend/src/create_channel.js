import { useRef, useState, useEffect, useContext } from 'react';
import {AuthContext} from "./context/AuthProvider.js";

import axios from './api_proxy/axios.js';
const CREATE_CHANNEL_URL = './api/channels/';

const CreateChannel = () => {
    const { auth,setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(CREATE_CHANNEL_URL,
                JSON.stringify({ name:user, description:pwd }),
                {
                    headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+auth.accessToken },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            console.log("Asdsad");
            window.location.href="/home";
            
        } catch (err) {
            console.log(err);
            
        }
    }

    return (
        <>
             
                <section>
                    
                    <h1>Create A New Channel</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Channel Name:</label>
                        <input
                        className='text-black'
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                        />

                        <label htmlFor="password">Description:</label>
                        <input
                            type="text"
                            className='text-black'
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                        <button>Create</button>
                    </form>
                   
                </section>
            
        </>
    )
}

export default CreateChannel;