import { Secret } from '@secret-manager/types/secret.type';

export type SecretDashboardPageParams = {
  domainId: string;
  secretPath: string;
};

export type SecretDashboardPageOutletContext = {
  secret: Secret;
};
