import { useState, ReactNode } from 'react';
import { ModalContext } from '../contexts/modalContext';
import Navbar from '../components/NavBar';
import Login from '../components/Login';
import Register from '../components/Register';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const [registerModalIsOpen, setRegisterModalIsOpen] = useState(false);

    return (
        <ModalContext.Provider value={{ loginModalIsOpen, setLoginModalIsOpen, registerModalIsOpen, setRegisterModalIsOpen }}>
            <Navbar />
            <Login />
            <Register />
            {children}
        </ModalContext.Provider>
    );
}

export default Layout;