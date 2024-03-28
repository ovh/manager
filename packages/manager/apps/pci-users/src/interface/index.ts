import { UseMutationResult } from '@tanstack/react-query';

export type Role = {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
};

export type Service = {
  name: string;
  permissions: Permission[];
};

export type Permission = {
  label: string;
  roles: string[];
};

export type User = {
  id?: number;
  username: string;
  creationDate: string;
  description: string;
  openstackId?: string;
  status: string;
  roles?: Role[];
  password?: string;
};

export interface Endpoint {
  region_id: string;
  type: string;
  url: string;
}

export interface OpenStackTokenResponse {
  'X-Auth-Token': string;
  token: {
    catalog: {
      type: string;
      endpoints: Endpoint[];
    }[];
  };
}

export type GenerateOpenStackTokenReturnType = {
  generate: () => void;
} & UseMutationResult<OpenStackTokenResponse, Error, void, unknown>;
