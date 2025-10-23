import { SeoStatus } from '../status';

export enum SeoCountry {
  FR = 'FR',
}

export enum SeoOffer {
  NORMAL = 'normal',
}

export type LocalSeoType = {
  accountId: number;
  address: string;
  country: SeoCountry;
  creationDate: string;
  id: number;
  lastUpdate: string;
  name: string;
  offer: SeoOffer;
  status: SeoStatus;
  taskId: number;
};

export type LocalSeoAccount = {
  creationDate: string;
  email: string;
  id: number;
  lastUpdate: string;
  status: SeoStatus;
  taskId: number;
};
