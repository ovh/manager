import { createContext } from 'react';

export enum ModalTypes {
  kyc,
  payment,
  agreements,
  suggestion,
}

export type ModalsContextType = {
  current: ModalTypes;
};

const ModalsContext = createContext<ModalsContextType>({} as ModalsContextType);

export default ModalsContext;
