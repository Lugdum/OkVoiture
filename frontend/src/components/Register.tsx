import { FC, useContext, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { ModalContext } from "../contexts/modalContext";
import { register_ok } from "../../services/apiUtils";

Modal.setAppElement("#__next");

// Register component
const Register: FC = () => {
  const { registerModalIsOpen, setRegisterModalIsOpen } =
    useContext(ModalContext);

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [role, setRole] = useState("particulier");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setRegisterError("Format de l'email incorrect");
      return;
    }

    // Check if register infos are corrects
    const isLoggedIn = await register_ok(email, name, password, role);

    if (!isLoggedIn) {
      setRegisterError("Cet email est déjà utilisé");
    }

    setRegisterModalIsOpen(false);
    setEmail("");
    setPassword("");
    setRegisterError("");
  };

  return (
    <Modal
      isOpen={registerModalIsOpen}
      onRequestClose={() => setRegisterModalIsOpen(false)}
      style={customStyles}
      contentLabel="Register Modal"
    >
      <h2>Connexion</h2>
      {/* Show form to register */}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom d'utilisateur"
          required
        />
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

        {/* Scroll bar to select role */}
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="particulier">Particulier</option>
          <option value="loueur">Loueur</option>
        </select>

        <button type="submit">OK</button>
        {registerError && <p>{registerError}</p>}
      </form>
    </Modal>
  );
};

export default Register;
