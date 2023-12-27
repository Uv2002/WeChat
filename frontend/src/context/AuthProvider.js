import { createContext, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    let auth, setAuth;
    if(localStorage.getItem("auth")){
         [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
    }
    else{
        [auth, setAuth] = useState({});
    }
    

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

// export default AuthProvider;