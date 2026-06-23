import { Handler } from '@ovh-ux/manager-core-test-utils';

export const getMeMocks = (params: {
  businessVerificationRequired?: boolean;
} = {}): Handler[] => {
  const { businessVerificationRequired = false } = params;

  return [
    {
      url: 'me',
      response: {
        businessVerificationRequired,
      },
      api: 'v6',
      delay: 0,
    },
  ];
};
