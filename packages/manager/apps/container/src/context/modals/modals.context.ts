import { createContext } from 'react';

export enum ModalTypes {
  kyc,
  payment,
  agreements,
}

export type ModalsContextType = {
  current: ModalTypes;
};

const ModalsContext = createContext<ModalsContextType>({} as ModalsContextType);

export default ModalsContext;
