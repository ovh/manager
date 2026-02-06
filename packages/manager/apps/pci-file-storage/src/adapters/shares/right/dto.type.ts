export type TShareCapabilityDto = {
  name: string;
  enabled: boolean;
};

export type TShareDto = {
  createdAt: string;
  description: string;
  id: string;
  isPublic: boolean;
  name: string;
  protocol: string;
  region: string;
  size: number;
  status: string;
  type: string;
  capabilities: TShareCapabilityDto[];
};
