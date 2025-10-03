import { Handler } from "@ovh-ux/manager-core-test-utils";

export const getProcedureMocks = (params: {
  identityStatus?: 'required' | 'open' | 'ok';
} = {}): Handler[] => {
  const { identityStatus = 'ok' } = params;

  return [
    {
      url: 'me/procedure/identity',
      response: {
        ticketId: '',
        status: identityStatus,
      },
      api: 'v6',
      delay: 0,
    },
  ];
};
