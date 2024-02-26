import TabsMenu from '@/components/tabs-menu';
import { H2 } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { useGetRegions } from '@/hooks/api/ai/useGetRegions';
import { useGetTokens } from '@/hooks/api/ai/useGetTokens';
import { useGetUsers } from '@/hooks/api/ai/useGetUsers';
import { useNavigate } from '@/hooks/useNavigation';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { ai, user } from '@/models/types';
import { UseQueryResult } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Outlet } from 'react-router-dom';

export const Handle = {
  breadcrumb: () => 'pci_ai_breadcrumb_ai_dashboard',
};

export type DashboardLayoutContext = {
  tokensQuery: UseQueryResult<ai.token.Token[], Error>;
  usersQuery: UseQueryResult<user.User[], Error>;
  regionsQuery: UseQueryResult<ai.capabilities.Region[], Error>;
};

export default function AiDashboardLayout() {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const tokensQuery = useGetTokens(projectId, {
    refetchInterval: 30_000,
  });
  const usersQuery = useGetUsers(projectId, {
    refetchInterval: 30_000,
  });
  const regionsQuery = useGetRegions(projectId, {
    refetchInterval: 30_000,
  });

  const tabs = [
    { href: 'home', label: 'Dashboard' },
    { href: 'users-tokens', label: 'Users & tokens' },
    { href: 'registries', label: 'Docker Registries' },
    { href: 'datastore', label: 'Datastore' },
    { href: 'cli', label: 'Command Line Interface' },
  ];

  const dashboardLayoutContext: DashboardLayoutContext = {
    usersQuery: usersQuery,
    tokensQuery: tokensQuery,
    regionsQuery: regionsQuery,
  };
  return (
    <>
      <H2>AI Dashboard</H2>
      <p>
        Artificial intelligence (AI) is often viewed as a technology reserved
        only for those who are experienced in the field. At OVHcloud, we believe
        in the incredible potential of this practice across all business
        sectors. We are therefore focused on providing tools that can address
        the challenges encountered by different organisations, including data
        processing, mining, training and model deployment. Our goal is to make
        Machine Learning easy to use for all user profiles.
      </p>
      <p>Discover our full AI Tools range!</p>
      <Button className='mb-4' variant="linkBis" size="sm" asChild>
        <a
          href={useNavigate(
            'public-cloud',
            `#/pci/project/${projectId}/prices/#ai-&-machine-learning`,
            {},
          )}
        >
          View service prices
          <ArrowRight className="w-4 h-4 ml-2" />
        </a>
      </Button>
      <TabsMenu tabs={tabs} />
      <Outlet context={dashboardLayoutContext} />
    </>
  );
}
