import { TLocalisation } from '@ovh-ux/manager-pci-common';
import { TCapability } from '@/api/data/capability';

export enum StepEnum {
  REGION = 'REGION',
  NAME = 'NAME',
  PLAN = 'PLAN',
}

export type TState = {
  region: TLocalisation;
  name: {
    value: string;
    touched: boolean;
  };
  plan: TCapability['plans'][0];
};

export type TStepperState = {
  [StepEnum.REGION]: {
    isOpen: boolean;
    isLocked: boolean;
    isChecked: boolean;
  };
  [StepEnum.NAME]: {
    isOpen: boolean;
    isLocked: boolean;
    isChecked: boolean;
  };
  [StepEnum.PLAN]: {
    isOpen: boolean;
    isLocked: boolean;
    isChecked: boolean;
  };
};
