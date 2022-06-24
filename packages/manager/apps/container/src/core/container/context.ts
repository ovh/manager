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
  isLoading: boolean;
  updateBetaChoice: (accept: boolean) => Promise<unknown>;
};

const ContainerContext = createContext<ContainerContext>(
  {} as ContainerContext,
);

export default ContainerContext;
