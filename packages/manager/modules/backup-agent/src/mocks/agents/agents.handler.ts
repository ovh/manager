import { PathParams } from 'msw';

import { Handler } from '@ovh-ux/manager-core-test-utils';

import { mockAgents } from '@/mocks/agents/agents';

export type TAgentMockParams = {
  isAgentsError?: boolean;
};

export const getAgentMocks = ({ isAgentsError = false }: TAgentMockParams = {}): Handler[] => [
  {
    url: '/backupServices/tenant/:backupServicesId/vspc/:vspcTenantId/backupAgent',
    response: () => {
      return isAgentsError ? null : mockAgents;
    },
    api: 'v2',
    method: 'get',
    status: isAgentsError ? 500 : 200,
    delay: 0,
  },
  {
    url: '/backupServices/tenant/:backupServicesId/vspc/:vspcTenantId/backupAgent/:backupAgentId',
    response: (_: unknown, params: PathParams) => {
      if (isAgentsError) return null;
      return mockAgents.find((agent) => agent.id === params.backupAgentId);
    },
    api: 'v2',
    method: 'get',
    status: isAgentsError ? 500 : 200,
    delay: 0,
  },
  {
    url: '/backupServices/tenant/:backupServicesId/vspc/:vspcTenantId/backupAgent/:backupAgentId',
    response: (_: unknown, params: PathParams) => {
      if (isAgentsError) return null;
      return mockAgents.find((agent) => agent.id === params.backupAgentId);
    },
    api: 'v2',
    method: 'delete',
    status: isAgentsError ? 500 : 200,
    delay: 0,
  },
];
