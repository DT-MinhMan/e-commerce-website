"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import _, { isEmpty, get} from "lodash";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
  const router = useRouter();
  const [token, setToken] = useState<any>("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userLocal = localStorage.getItem("user") || '{}';
    if (!!token) {
      setToken(token)
      setIsUserAuthenticated(true);
      setIsAdmin(_.get(JSON.parse(userLocal), 'role') === 'admin');
    } else {
      router.push("/login");
      setIsUserAuthenticated(false)
    }
    setLoading(false);
  }, [token]);

  const onLogin = async (userInfo: object, token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
    if (_.get(userInfo, 'role') === 'admin'){
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    router.push("/");
    setIsUserAuthenticated(true);
  };

  const onSignUp = async (user: string) => {
    // localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    router.push("/login");
  };

  const onLogout = () => {
    localStorage.clear();
    setToken("");
    setUser(undefined);
    setIsUserAuthenticated(false)
    router.push("/login");
  };

  const isAuthen = () => {
    if(!!token){
      return token
    }
    return true
  }


  const contexts = {
    isUserAuthenticated,
    isAuthen,
    onLogin,
    loading,
    onLogout,
    user,
    onSignUp,
    isAdmin,
    token,
  };

  return <AuthContext.Provider value={contexts}>{children}</AuthContext.Provider>;
};


interface AuthenticationProps {
  onLogin: () => void;
  onLogout: () => void;
  token: string;
  user: any;
  onSignUp: () => void;
  isUserAuthenticated: boolean;
  isAuthen: () => void;
  loading: boolean;
}

export const useAuth = (): AuthenticationProps => useContext(AuthContext) as AuthenticationProps


