import { FunctionComponent } from 'react';
import { UndefinedInitialDataOptions } from '@tanstack/react-query';
import { Environment, User } from '@ovh-ux/manager-config';

export type BuildUrlParams = {
  appName: string | ((environment: Environment) => string);
  appPath: string | ((environment: Environment) => string);
};

export type ModalToDisplayConfiguration = {
  checks: {
    userCheck?: (user: User) => boolean;
    iamRights?: string[];
    featuresAvailability?: string[];
    intervalInSeconds?: number;
    excludedUrls?: BuildUrlParams[];
    includedUrls?: BuildUrlParams[];
  };
  data?: {
    queryParams: UndefinedInitialDataOptions;
    check?: (data: unknown) => boolean;
  };
  component: FunctionComponent;
};
