import { useContext } from "react";
import { useRouter } from "next/router";
import { ModalContext } from "../contexts/modalContext";
import { AuthContext } from "../contexts/AuthContext";

// Navigation bar component
const NavBar = () => {
  let { user } = useContext(AuthContext);

  const { setLoginModalIsOpen, setRegisterModalIsOpen } =
    useContext(ModalContext);
  const { privilege, logout } = useContext(AuthContext);
  const router = useRouter();

  // Logout button
  const handleLogoutClick = () => {
    logout();
  };

  // Home button
  const handleHomeClick = () => {
    router.push("/listings");
  };

  // Cars button
  const handleFormClick = () => {
    router.push("/cars");
  };

  // Bookings button
  const handleBookingsClick = () => {
    router.push("/bookings");
  };

  return (
    <nav className={`p-5 flex justify-between bg-color4`}>
      <div className={`flex`}>
        {/* Show Home button if connected and not on Home */}
        {(router.pathname !== "/listings" && privilege > 1) ||
        router.pathname == "/bookings" ? (
          <button
            onClick={handleHomeClick}
            className={`bg-green-500 hover:bg-green-600 text-white font-normal py-2 px-4 rounded mr-8`}
          >
            Home
          </button>
        ) : (
          ""
        )}
        {/* Show Cars button if connected as loueur or admin and not on Cars */}
        {router.pathname !== "/cars" && privilege > 1 ? (
          <button
            onClick={handleFormClick}
            className={`bg-green-500 hover:bg-green-600 text-white font-normal py-2 px-4 rounded mr-8`}
          >
            Cars
          </button>
        ) : (
          ""
        )}
        {/* Show Booking button if connected as particulier or admin and not on Home */}
        {router.pathname !== "/bookings" &&
        privilege !== 2 &&
        privilege !== 0 ? (
          <button
            onClick={handleBookingsClick}
            className={`bg-green-500 hover:bg-green-600 text-white font-normal py-2 px-4 rounded mr-8`}
          >
            Bookings
          </button>
        ) : (
          ""
        )}
      </div>
      <div className={`flex`}>
        {/* Show user name and logout button if connected */}
        {privilege > 0 ? (
          <div>
            <span
              className={`inline-block rounded px-4 py-1.5 text-white bg-blue-500 font-bold text-lg mr-10`}
            >
              {" "}
              Welcome {user?.name}
            </span>
            <button
              onClick={handleLogoutClick}
              className={`bg-green-500 hover:bg-green-600 text-white font-normal py-2 px-4 rounded`}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            {/* Show login and register buttons if not connected */}
            <button
              onClick={() => setLoginModalIsOpen(true)}
              className={`bg-green-500 hover:bg-green-600 text-white font-normal py-2 px-4 rounded mr-8`}
            >
              Login
            </button>
            <button
              onClick={() => setRegisterModalIsOpen(true)}
              className={`bg-green-500 hover:bg-green-600 text-white font-normal py-2 px-4 rounded`}
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
