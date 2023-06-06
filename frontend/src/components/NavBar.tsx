import { useContext } from "react";
import { useRouter } from "next/router";
import { ModalContext } from "../contexts/modalContext";
import { AuthContext } from "../contexts/AuthContext";
import styles from "../styles/NavBar.module.css";

const NavBar = () => {
  const { setLoginModalIsOpen, setRegisterModalIsOpen } =
    useContext(ModalContext);
  const { privilege, logout } = useContext(AuthContext);

  const router = useRouter();

  const handleLogoutClick = () => {
    logout();
  };

  const handleHomeClick = () => {
    router.push("/listings");
  };

  const handleFormClick = () => {
    router.push("/form");
  };

  const handleAdminClick = () => {
    router.push("/admin");
  };

  const handleBookingsClick = () => {
    router.push("/edit");
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.leftSide}>
        {(router.pathname !== "/listings" && privilege > 1) ||
        router.pathname == "/edit" ? (
          <button onClick={handleHomeClick}>Home</button>
        ) : (
          ""
        )}
        {router.pathname !== "/form" && privilege > 1 ? (
          <button onClick={handleFormClick}>Form</button>
        ) : (
          ""
        )}
        {router.pathname !== "/edit" && privilege !== 2 ? (
          <button onClick={handleBookingsClick}>Bookings</button>
        ) : (
          ""
        )}
      </div>
      <div className={styles.rightSide}>
        {privilege > 0 ? (
          <button onClick={handleLogoutClick}>Logout</button>
        ) : (
          <>
            <button onClick={() => setLoginModalIsOpen(true)}>Login</button>
            <button onClick={() => setRegisterModalIsOpen(true)}>
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
