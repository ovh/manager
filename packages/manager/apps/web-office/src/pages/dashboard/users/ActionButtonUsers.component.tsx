import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { UserStateEnum } from '@/data/api/api.type';
import { UserNativeType } from '@/data/api/users/type';
import { LicenseType } from '@/data/api/license/type';
import { useGenerateUrl } from '@/hooks';
import {
  APP_NAME,
  DELETE_ACCOUNT,
  EDIT_ACCOUNT,
  EDIT_PASSWORD,
} from '@/tracking.constants';

interface ActionButtonUsersProps {
  usersItem: UserNativeType;
  licenceDetail: LicenseType;
}
const ActionButtonUsers: React.FC<ActionButtonUsersProps> = ({
  usersItem,
  licenceDetail,
}) => {
  const { t } = useTranslation('dashboard/users');
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const hrefDeleteUsers = useGenerateUrl('./delete', 'path', {
    activationEmail: usersItem.activationEmail,
    ...(!licenceDetail.serviceType && {
      licencePrepaidName: usersItem.serviceName,
    }),
  });

  const hrefEditUsers = useGenerateUrl('./edit', 'path', {
    activationEmail: usersItem.activationEmail,
    ...(!licenceDetail.serviceType && {
      licencePrepaidName: usersItem.serviceName,
    }),
  });

  const hrefChangePasswordUsers = useGenerateUrl('./change-password', 'path', {
    activationEmail: usersItem.activationEmail,
    ...(!licenceDetail.serviceType && {
      licencePrepaidName: usersItem.serviceName,
    }),
  });

  const tracking = (action: string) =>
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [action, APP_NAME],
    });
  const handlePasswordChangeClick = () => {
    tracking(EDIT_PASSWORD);
    navigate(hrefChangePasswordUsers);
  };

  const handleDeleteUserClick = () => {
    tracking(DELETE_ACCOUNT);
    navigate(hrefDeleteUsers);
  };

  const handleEditUserClick = () => {
    tracking(EDIT_ACCOUNT);
    navigate(hrefEditUsers);
  };

  const actionItems = [
    {
      id: 1,
      onclick: handleEditUserClick,
      label: t('dashboard_users_action_user_edit'),
      urn: licenceDetail.iam.urn,
      iamActions: [
        ...(!licenceDetail.tenantServiceName
          ? [IAM_ACTIONS.user.edit]
          : [IAM_ACTIONS.licencePrepaid.edit]),
      ],
    },
    ...(!usersItem.isVirtual
      ? [
          {
            id: 2,
            onclick: handlePasswordChangeClick,
            label: t('dashboard_users_action_user_change_password'),
            urn: licenceDetail.iam.urn,
            iamActions: [
              ...(!licenceDetail.tenantServiceName
                ? [IAM_ACTIONS.user.password]
                : [IAM_ACTIONS.licencePrepaid.changePassword]),
            ],
          },
        ]
      : []),
    ...(!usersItem.isVirtual
      ? [
          {
            id: 3,
            onclick: handleDeleteUserClick,
            label: t('dashboard_users_action_user_delete'),
            urn: licenceDetail.iam.urn,
            iamActions: [
              ...(!licenceDetail.tenantServiceName
                ? [IAM_ACTIONS.user.delete]
                : [IAM_ACTIONS.licencePrepaid.unconfigure]),
            ],
            color: ODS_BUTTON_COLOR.critical,
          },
        ]
      : []),
  ];
  return (
    <ActionMenu
      id={usersItem.activationEmail.replace(/@|\./g, '_')}
      isDisabled={usersItem.status !== UserStateEnum.OK}
      items={actionItems}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};

export default ActionButtonUsers;
