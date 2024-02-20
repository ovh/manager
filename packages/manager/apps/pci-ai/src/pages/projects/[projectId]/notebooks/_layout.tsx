import { useRequiredParams } from '@/hooks/useRequiredParams';
import { Link, Outlet } from 'react-router-dom';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

import { useGetTokens } from '@/hooks/api/ai/useGetTokens';
import { useGetUsers } from '@/hooks/api/ai/useGetUsers';
import { user } from '@/models/types';

export const Handle = {
  breadcrumb: () => 'pci_ai_breadcrumb_notebooks',
};

export default function NotebooksLayout() {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const linkUserToken = `/projects/${projectId}/ai-dashboard/users-tokens`;
  const tokenQuery = useGetTokens(projectId, {
    refetchInterval: 30_000,
  });
  const userQuery = useGetUsers(projectId, {
    refetchInterval: 30_000,
  });
  const isUserConfigured: boolean =
    userQuery.data?.some((user: user.User) =>
      user.roles.some(
        (role: user.Role) => role.name === 'ai_training_operator',
      ),
    ) || false;

  return (
    <>
      {!(
        isUserConfigured ||
        (tokenQuery.data && tokenQuery.data?.length > 0)
      ) && (
        <div className="mt-2">
          <Alert variant="default">
            <Info className="h-6 w-6" />
            <p>
              To use AI Tools, please ensure that you are using a configured AI
              user or a token.
            </p>
            <Button variant="link" size="sm" asChild>
              <Link
                className="text-slate-950 hover:text-slate-950 hover:underline"
                to={linkUserToken}
              >
                <strong>Manage my AI users and tokens</strong>
              </Link>
            </Button>
          </Alert>
        </div>
      )}
      <Outlet />
    </>
  );
}
