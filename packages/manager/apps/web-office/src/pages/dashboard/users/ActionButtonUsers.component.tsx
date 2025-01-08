import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { UserStateEnum } from '@/api/api.type';
import { UserNativeType } from '@/api/users/type';
import { LicenseType } from '@/api/license/type';

interface ActionButtonUsersProps {
  usersItem: UserNativeType;
  licenseDetail: LicenseType;
}
const ActionButtonUsers: React.FC<ActionButtonUsersProps> = ({
  usersItem,
  licenseDetail,
}) => {
  const { t } = useTranslation('dashboard/users');

  const handlePasswordChangeClick = () => {
    // @todo: for next user story
    console.log('handlePasswordChangeClick');
  };

  const handleDeleteUserClick = () => {
    // @todo: for next user story
    console.log('handleDeleteUserClick');
  };

  const handleEditUserClick = () => {
    // @todo: for next user story
    console.log('handleEditUserClick');
  };

  const actionItems = [
    ...(!usersItem.isVirtual
      ? [
          {
            id: 1,
            onclick: handlePasswordChangeClick,
            label: t('dashboard_users_action_user_change_password'),
            urn: licenseDetail.iam.urn,
            iamActions: [
              ...(!licenseDetail.tenantServiceName
                ? [IAM_ACTIONS.user.password]
                : [IAM_ACTIONS.licencePrepaid.changePassword]),
            ],
          },
        ]
      : []),
    {
      id: 2,
      onclick: handleEditUserClick,
      label: t('dashboard_users_action_user_edit'),
      urn: licenseDetail.iam.urn,
      iamActions: [
        ...(!licenseDetail.tenantServiceName
          ? [IAM_ACTIONS.user.edit]
          : [IAM_ACTIONS.licencePrepaid.edit]),
      ],
    },
    ...(!usersItem.isVirtual
      ? [
          {
            id: 3,
            onclick: handleDeleteUserClick,
            label: t('dashboard_users_action_user_delete'),
            urn: licenseDetail.iam.urn,
            iamActions: [
              ...(!licenseDetail.tenantServiceName
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
