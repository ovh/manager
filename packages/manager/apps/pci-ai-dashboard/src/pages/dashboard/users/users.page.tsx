import { ArrowRight, Plus } from 'lucide-react';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import OvhLink from '@/components/links/OvhLink.component';
import { Button } from '@/components/ui/button';
import { POLLING } from '@/configuration/polling';
import { useGetUsers } from '@/hooks/api/user-api/useGetUsers';
import { user } from '@/types/user';

export default function Users() {
  const { projectId } = useParams();
  const userQuery = useGetUsers(projectId, {
    refetchInterval: POLLING.USERS,
  });

  const aiUsers: number = useMemo(
    () =>
      (userQuery.isSuccess &&
        userQuery.data?.filter((us: user.User) =>
          us.roles.find(
            (role: user.Role) =>
              role.name === user.AIUserRoleEnum.ai_training_operator ||
              role.name === user.AIUserRoleEnum.ai_training_operator,
          ),
        ).length) ||
      0,
    [userQuery.data],
  );

  const userPath = `#/pci/project/${projectId}/users`;

  return (
    <>
      <h3>Manage access with Public Cloud users</h3>
      <p>
        When you work with our tools, you need to authenticate yourself through
        common users in your Public Cloud project.
      </p>
      <p>
        Public Cloud users allow you to access your notebooks, jobs and
        applications. In order to freely experiment, you must choose at least an
        “Admin” or “AI” role.
      </p>
      <div className="flex flew-row gap-3 mt-3">
        <Button variant="default" type="button" size="sm" asChild>
          <OvhLink
            className="hover:no-underline hover:text-primary-foreground"
            application="public-cloud"
            path={userPath}
          >
            Manage my AI users ({aiUsers})
          </OvhLink>
        </Button>
        <Button
          // onClick={() => setIsAddUserModalOpen(true)}
          className="font-semibold"
          variant="outline"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create an AI user{/* isAddUserModalOpen */}
        </Button>
      </div>
    </>
  );
}
