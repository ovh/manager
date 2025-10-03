import { Application, LangId, Region, User } from '@ovh-ux/manager-config';

// Few issues with the configuration type:
// containerURL, enabled and path are mandatory in the type Container but not on API side
// universe is mandatory in the type Application but not on API side
// currency property on User should have an optional property format
export type Configuration = {
  applications: Record<string, Application>;
  region: Region;
  universe: string;
  message: {
    [key in LangId]: { description: string };
  };
  user: User & UserComplementaryFields;
  applicationURLs: Record<string, string>;
};

// Required Complementary Fields for the User type
// Should be completed on @ovh-ux/manager-config package
type UserComplementaryFields = {
  complementaryAddress: string | null;
  phoneType?: string;
  purposeOfPurchase: string | null;
};