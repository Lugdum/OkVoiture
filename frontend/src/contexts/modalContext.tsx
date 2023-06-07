import { createContext, Dispatch, SetStateAction } from "react";

// Modal context properties
interface ModalContextProps {
  loginModalIsOpen: boolean;
  setLoginModalIsOpen: Dispatch<SetStateAction<boolean>>;
  registerModalIsOpen: boolean;
  setRegisterModalIsOpen: Dispatch<SetStateAction<boolean>>;
}

// Create context
export const ModalContext = createContext<ModalContextProps>({
  loginModalIsOpen: false,
  setLoginModalIsOpen: () => {},
  registerModalIsOpen: false,
  setRegisterModalIsOpen: () => {},
});
