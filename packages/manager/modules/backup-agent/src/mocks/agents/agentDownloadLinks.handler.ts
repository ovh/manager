import { Handler } from '@ovh-ux/manager-core-test-utils';

import { mockAgentDownloadLinks } from '@/mocks/agents/agentDownloadLinks';

export type TAgentDownloadLinkMockParams = {
  isAgentDownloadLinksError?: boolean;
};

export const getAgentDownloadLinksMocks = ({
  isAgentDownloadLinksError = false,
}: TAgentDownloadLinkMockParams = {}): Handler[] => [
  {
    url: '/backupServices/tenant/:backupServicesId/vspc/:vspcTenantId/backupAgent',
    response: () => {
      return isAgentDownloadLinksError ? null : mockAgentDownloadLinks;
    },
    api: 'v2',
    method: 'get',
    status: isAgentDownloadLinksError ? 500 : 200,
    delay: 0,
  },
];
