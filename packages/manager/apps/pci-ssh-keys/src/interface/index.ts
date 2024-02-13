export type SshKey = {
  id?: string;
  name: string;
  publicKey: string;
  fingerPrint?: string;
  regions?: string[];
};
