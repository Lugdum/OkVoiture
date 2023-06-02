import { createContext, Dispatch, SetStateAction } from "react";

interface ModalContextProps {
  loginModalIsOpen: boolean;
  setLoginModalIsOpen: Dispatch<SetStateAction<boolean>>;
  registerModalIsOpen: boolean;
  setRegisterModalIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const ModalContext = createContext<ModalContextProps>({
  loginModalIsOpen: false,
  setLoginModalIsOpen: () => {},
  registerModalIsOpen: false,
  setRegisterModalIsOpen: () => {},
});
