import { FC, useContext, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { ModalContext } from '../contexts/modalContext';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Listings.module.css'

Modal.setAppElement('#__next')

const Register: FC = () => {
    const { registerModalIsOpen, setRegisterModalIsOpen } = useContext(ModalContext);

    const customStyles = {
        content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        },
        overlay: { zIndex: 1000 },
    };

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registerError, setRegisterError] = useState('');
    const [role, setRole] = useState('particulier');


    const register_ok = async (email:string, name:string, password:string, role:string) => {
        try {
            console.log(email, name, password, role)
            const response = await axios.post('http://localhost:4000/users', { email: email, name: name, password: password, role: role });
            console.log(response.data);
        if (!response.data.code) {
            return true;
        } 
        } catch (error) {
            console.error(error);
        }

        return false;
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
        setRegisterError("Format de l\'email incorrect");
        return;
        }

        const isLoggedIn = await register_ok(email, name, password, role);
        console.log(isLoggedIn);

        if (!isLoggedIn) {
            setRegisterError("Cet email est déjà utilisé");
        }
        else {
            setRegisterModalIsOpen(false);
            setEmail('');
            setPassword('');
            setRegisterError('');
        }
    };

    return (
        <Modal
        isOpen={registerModalIsOpen}
        onRequestClose={() => setRegisterModalIsOpen(false)}
        style={customStyles}
        contentLabel="Register Modal"
        >
        <h2>Connexion</h2>
        <form onSubmit={handleRegister}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom d'utilisateur" required />
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" required />

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