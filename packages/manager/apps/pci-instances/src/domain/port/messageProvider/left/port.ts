export type MessageProviderPort = {
    getMessage: (key: string) => string;
}