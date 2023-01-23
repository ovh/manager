import { Application } from '@ovh-ux/manager-config';
import { createContext } from 'react';

export enum BetaVersion {
  beta1 = 1,
  beta2 = 2,
}

export type ContainerContextType = {
  createBetaChoice: (accept?: boolean) => Promise<unknown>;
  askBeta: boolean;
  betaVersion: BetaVersion;
  useBeta: boolean;
  isLivechatEnabled: boolean;
  isLoading: boolean;
  updateBetaChoice: (accept: boolean) => Promise<unknown>;
  chatbotOpen: boolean;
  setChatbotOpen: (isOpen: boolean) => void;
  chatbotReduced: boolean;
  setChatbotReduced: (isReduced: boolean) => void;
  application: Application;
  setApplication: (appConfig: Application) => void;
  universe: string;
  setUniverse: (universe: string) => void;
};

export const ContainerContext = createContext<ContainerContextType>(
  {} as ContainerContextType,
);

export default ContainerContext;
