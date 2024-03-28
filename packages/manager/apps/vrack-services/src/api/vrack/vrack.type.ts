import { IamMetadata } from '../api.type';

export type Vrack = {
  name: string;
  description: string;
};

export type VrackWithIAM = Vrack & IamMetadata;
