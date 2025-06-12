declare class ReketInstance {
  get<T>(configurationURL: string, requestOptions: unknown): Promise<T>;
}

declare module '@ovh-ux/ovh-reket' {
  const useReket: (
    enableSsoAuth?: boolean,
    requestTypes?: string | Array<unknown>,
  ) => ReketInstance;
}
