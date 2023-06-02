import { FC, useContext, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { ModalContext } from "../contexts/modalContext";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/Listings.module.css";
import { useRouter } from "next/router";

Modal.setAppElement("#__next");

const Login: FC = () => {
  const { loginModalIsOpen, setLoginModalIsOpen } = useContext(ModalContext);
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
    overlay: { zIndex: 1000 },
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const login_ok = async (email: string) => {
    try {
      const response = await axios.get("http://localhost:4000/users/log", {
        params: { email: email, password: password },
      });

      console.log(response.data);
      if (!response.data.code) {
        let p = 1;
        if (response.data.role === "particulier") p = 1;
        else if (response.data.role === "loueur") p = 2;
        else if (response.data.role === "admin") p = 3;
        login(response.data, p);
        return p;
      }
    } catch (error) {
      console.error(error);
    }

    return 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) && email != 'admin') {
      setLoginError("Format de l'email incorrect");
      return;
    }

    const isLoggedIn = await login_ok(email);
    console.log(isLoggedIn);

    if (isLoggedIn == 0) {
      setLoginError("Email ou mot de passe incorrect");
    } else {
      setLoginModalIsOpen(false);
      setEmail("");
      setPassword("");
      setLoginError("");
      if (isLoggedIn == 2) router.push("/form");
    }
  };

  return (
    <Modal
      isOpen={loginModalIsOpen}
      onRequestClose={() => setLoginModalIsOpen(false)}
      style={customStyles}
      contentLabel="Login Modal"
    >
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
        />
        <button type="submit">OK</button>
        {loginError && <p>{loginError}</p>}
      </form>
    </Modal>
  );
};

export default Login;
