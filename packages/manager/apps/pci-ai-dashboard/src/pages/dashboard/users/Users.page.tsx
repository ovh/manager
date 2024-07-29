import { Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import OvhLink from '@/components/links/OvhLink.component';
import { Button } from '@/components/ui/button';
import { POLLING } from '@/configuration/polling';
import { useGetUsers } from '@/hooks/api/user/useGetUsers.hook';
import { user } from '@/types/user';
import { useModale } from '@/hooks/useModale.hook';
import AddUser from './_components/AddUser.component';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import Guides from '@/components/guides/Guides.component';
import { GuideSections } from '@/types/guide';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-ai-dashboard/users"
    />
  );
}

const Users = () => {
  const { t } = useTranslation('pci-ai-dashboard/users');
  const { projectId } = useParams();
  const addModale = useModale('add');
  const userQuery = useGetUsers(projectId, {
    refetchInterval: POLLING.USERS,
  });
  const queryClient = useQueryClient();
  const userPath = `#/pci/project/${projectId}/users`;

  return (
    <>
      <div className="float-right">
        <Guides section={GuideSections.users} />
      </div>
      <h3>{t('title')}</h3>
      <p>{t('userParagraphe1')}</p>
      <p>{t('userParagraphe2')}</p>
      <p>{t('userParagraphe3')}</p>
      <div className="flex flew-row gap-3 mt-3">
        <Button
          data-testid="manage-user-button"
          variant="default"
          type="button"
          size="sm"
          asChild
        >
          <OvhLink
            className="hover:no-underline hover:text-primary-foreground"
            application="public-cloud"
            path={userPath}
          >
            {t('manageButtonLabel', {
              number: userQuery.data?.filter((us: user.User) =>
                us.roles.find(
                  (role: user.Role) =>
                    role.name === user.AIUserRoleEnum.ai_training_operator ||
                    role.name === user.AIUserRoleEnum.ai_training_read,
                ),
              ).length,
            })}
          </OvhLink>
        </Button>
        <Button
          data-testid="create-user-button"
          onClick={() => addModale.open()}
          className="font-semibold"
          variant="outline"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('addButtonLabel')}
        </Button>
      </div>
      <AddUser
        controller={addModale.controller}
        onSuccess={async (newUser) => {
          const users: user.User[] = queryClient.getQueryData([
            projectId,
            'user',
          ]);
          users.push(newUser);
          queryClient.setQueryData([projectId, 'user'], users);
        }}
        onClose={() => addModale.close()}
      />
    </>
  );
};

export default Users;
