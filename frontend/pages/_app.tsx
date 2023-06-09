import { AuthProvider } from "../src/contexts/AuthContext";
import "../src/app/globals.css";
import Layout from "../src/app/layout";
import { AppProps } from "next/app";
import { ModalContext } from "../src/contexts/modalContext";
import Navbar from "../src/components/NavBar";
import Login from "../src/components/Login";
import Register from "../src/components/Register";
import { useState } from "react";

// Main
const MyApp = ({ Component, pageProps }: AppProps) => {
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [registerModalIsOpen, setRegisterModalIsOpen] = useState(false);
  return (
    <AuthProvider>
      <ModalContext.Provider
        value={{
          loginModalIsOpen,
          setLoginModalIsOpen,
          registerModalIsOpen,
          setRegisterModalIsOpen,
        }}
      >
        <Layout>
          <Login />
          <Register />
          <Component {...pageProps} />
        </Layout>
      </ModalContext.Provider>
    </AuthProvider>
  );
};

export default MyApp;
