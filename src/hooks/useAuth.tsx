import React, { createContext, useContext, useEffect, useState } from "react";

const authContext = createContext<ReturnType<typeof useProvideAuth> | null>(null);

export function ProvideAuth({ children }: React.PropsWithChildren<{}>) {
  const auth = useProvideAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};
// Provider hook that creates auth object and handles state
type LoginProps = {
  email: string;
  password: string;
};

type RegisterProps = {
  email: string;
  password: string;
  dob: string;
  fullname: string;
  phoneNumber: string;
};
type User = {
  email: string;
  password: string;
  dob: string;
  fullname: string;
  phoneNumber: string;
};
function useProvideAuth() {
  const [user, setUser] = useState<User | null>(null);
  function saveUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
  }
  function getUser() {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  function clearUser() {
    localStorage.removeItem("user");
  }

  const signin = async ({ email, password }: LoginProps) => {
    const res = await fetch("https://localhost:7193/api/Authen/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      credentials: "include",
    });
    if (res.status !== 200) throw new Error("Tài khoản hoặc mật khẩu không đúng");

    const data = await res.json();

    setUser(data);
    saveUser(data);
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  };
  const signup = async ({ dob, email, fullname, password, phoneNumber }: RegisterProps) => {
    try {
      const res = await fetch("https://localhost:7193/api/Authen/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          fullname,
          dob,
          phoneNumber,
        }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setUser(data);
      saveUser(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const signout = () => {
    clearUser();
    setUser(null);
  };
  useEffect(() => {
    //Load user from local storage
    const user = getUser();
    if (user) {
      setUser(user);
    }
  }, []);
  // Return the user object and auth methods
  return {
    user,
    signin,
    signup,
    signout,
  };
}
