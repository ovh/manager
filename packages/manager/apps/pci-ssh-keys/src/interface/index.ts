export type TSshKey = {
  id?: string;
  name: string;
  publicKey: string;
  fingerPrint?: string;
  regions?: string[];
};
