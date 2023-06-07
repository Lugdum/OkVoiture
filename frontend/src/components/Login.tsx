import { FC, useContext, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { ModalContext } from "../contexts/modalContext";
import { AuthContext } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import { login_ok } from "../../services/apiUtils";

Modal.setAppElement("#__next");

// Login component
const Login: FC = () => {
  const { loginModalIsOpen, setLoginModalIsOpen } = useContext(ModalContext);
  const { login } = useContext(AuthContext);
  const router = useRouter();

  // Center Modal
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

  // User infos
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Call API to try to log in
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if email is valid or if it's the admin
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) && email != "admin") {
      setLoginError("Format de l'email incorrect");
      return;
    }

    // Check if login infos are corrects
    const isLoggedIn = await login_ok(email, password, login);

    if (isLoggedIn == 0) {
      setLoginError("Email ou mot de passe incorrect");
      return;
    }

    setLoginModalIsOpen(false);
    setEmail("");
    setPassword("");
    setLoginError("");
    if (isLoggedIn == 2) router.push("/cars");
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
