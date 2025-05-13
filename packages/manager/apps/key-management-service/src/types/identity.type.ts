export type IdentityType = 'user' | 'account' | 'group' | 'credential';
export type IdentityRegion = 'eu' | 'ca' | 'us' | 'labeu';
export type IdentityEntity = 'identity';

export type IdentityObject = {
  version: number;
  region: IdentityRegion;
  entity: IdentityEntity;
  type: IdentityType;
  account: string;
  id: string | null;
  urn: string;
};

export enum IdentityStatus {
  disabled = 'DISABLED',
  ok = 'OK',
  password_change_required = 'PASSWORD_CHANGE_REQUIRED',
}

export type IdentityUser = {
  creation: string;
  description: string;
  email: string;
  group: string;
  lastUpdate: string;
  login: string;
  passwordLastUpdate: string;
  status: IdentityStatus;
  urn: string;
};
enum IdentityGroupRole {
  admin = 'ADMIN',
  none = 'NONE',
  regular = 'REGULAR',
  unprivileged = 'UNPRIVILEGED',
}

export type IdentityGroup = {
  creation: string;
  defaultGroup: boolean;
  description: string | null;
  lastUpdate: string;
  name: string;
  role: IdentityGroupRole;
  urn: string;
};

enum IdentityOauthClientFlow {
  authorization_code = 'AUTHORIZATION_CODE',
  client_credentials = 'CLIENT_CREDENTIALS',
}

export type IdentityOauthClient = {
  callbackUrls: string[];
  clientId: string;
  createdAt: string;
  description: string;
  flow: IdentityOauthClientFlow;
  identity: string | null;
  name: string;
};

export type IdentitiesType = IdentityUser | IdentityGroup | IdentityOauthClient;
