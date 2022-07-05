import { createContext } from 'react';

export enum BetaVersion {
  beta1 = 1,
  beta2 = 2,
}

export type ContainerContext = {
  createBetaChoice: (accept?: boolean) => Promise<unknown>;
  askBeta: boolean;
  betaVersion: BetaVersion;
  useBeta: boolean;
  isChatbotEnabled: boolean;
  isLivechatEnabled: boolean;
  isLoading: boolean;
  updateBetaChoice: (accept: boolean) => Promise<unknown>;
  chatbotOpen: boolean;
  setChatbotOpen: (isOpen: boolean) => void;
  chatbotReduced: boolean;
  setChatbotReduced: (isReduced: boolean) => void;
};

const ContainerContext = createContext<ContainerContext>(
  {} as ContainerContext,
);

export default ContainerContext;
