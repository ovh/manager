import { Application, LangId, Region, User } from "@ovh-ux/manager-config";

export type ApplicationProviderOptions = {
  region?: Region;
  user?: Partial<User>;
  applications?: Record<string, Application>;
  universe?: string;
  message?: {
    [key in LangId]: { description: string };
  };
  applicationURLs?: Record<string, string>;
};
