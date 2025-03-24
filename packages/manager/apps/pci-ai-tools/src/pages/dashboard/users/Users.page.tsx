import { Plus } from 'lucide-react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as role from '@datatr-ux/ovhcloud-types/cloud/role/index';
import { Button } from '@datatr-ux/uxlib';
import user from '@/types/User';
import ai from '@/types/AI';
import OvhLink from '@/components/links/OvhLink.component';
import { GuideSections } from '@/configuration/guide';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import Guides from '@/components/guides/Guides.component';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import { useGetUsers } from '@/data/hooks/user/useGetUsers.hook';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="ai-tools/dashboard/users"
    />
  );
}

const Users = () => {
  const { t } = useTranslation('ai-tools/dashboard/users');
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isUserActive } = useUserActivityContext();
  const userQuery = useGetUsers(projectId, {
    refetchInterval: isUserActive && POLLING.USERS,
  });
  const userPath = `#/pci/projects/${projectId}/users`;
  return (
    <>
      <div className="float-right">
        <Guides section={[GuideSections.users]} />
      </div>
      <h3>{t('title')}</h3>
      <p>{t('userParagraphe1')}</p>
      <p>{t('userParagraphe2')}</p>
      <p>{t('userParagraphe3')}</p>
      <div className="flex flew-row gap-3 mt-3">
        <Button data-testid="manage-user-button" type="button" asChild>
          <OvhLink
            className="hover:no-underline hover:text-primary-foreground"
            application="public-cloud"
            path={userPath}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('manageButtonLabel', {
              number: userQuery.data?.filter(
                (us: user.User) =>
                  us.status === user.UserStatusEnum.creating ||
                  us.roles.find(
                    (aiRole: role.Role) =>
                      aiRole.name === ai.TokenRoleEnum.ai_training_operator ||
                      aiRole.name === ai.TokenRoleEnum.ai_training_read,
                  ),
              ).length,
            })}
          </OvhLink>
        </Button>
        <Button
          data-testid="create-user-button"
          onClick={() => navigate('./add')}
          mode="outline"
        >
          <Plus className="size-5 mr-2" />
          {t('addButtonLabel')}
        </Button>
      </div>
      <Outlet />
    </>
  );
};

export default Users;
