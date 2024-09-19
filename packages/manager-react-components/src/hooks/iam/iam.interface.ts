export interface IamInterface {
  urns?: string[];
  actions?: string[];
}

export interface IamAuthorizationResponse {
  isAuthorized: boolean;
  isLoading: boolean;
  isFetched: boolean;
}

export interface IamCheckResponse {
  urn: string;
  authorizedActions: string[];
  unauthorizedActions: string[];
}
