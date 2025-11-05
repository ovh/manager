import { Handler } from '@ovh-ux/manager-core-test-utils';

import {mockAgents} from "@/mocks/agents/agents";

export type TAgentMockParams = {
  isAgentsError?: boolean;
};

export const getAgentMocks = ({
  isAgentsError = false,
}: TAgentMockParams = {}): Handler[] => [
  {
    url: '/backup/tenant/vspc/:vspcTenantId/backupAgent',
    response: () => {
      return isAgentsError
        ? null
        : mockAgents;
    },
    api: 'v2',
    method: 'get',
    status: isAgentsError ? 500 : 200,
  },
];
