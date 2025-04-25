export interface PCI {
  projectId: string;
}

export interface TokenData extends PCI {
  name?: string;
  description?: string;
  expiresAt?: string;
  token?: string;
}

export interface TokensPayload {
  projectId: string;
  name: string;
  description: string;
  expiresAt: string;
}
