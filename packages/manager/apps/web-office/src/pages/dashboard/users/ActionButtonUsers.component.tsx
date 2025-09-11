import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { APP_NAME, DELETE_ACCOUNT, EDIT_ACCOUNT, EDIT_PASSWORD } from '@/Tracking.constants';
import { UserStateEnum } from '@/data/api/ApiType';
import { LicensePrepaidType, LicenseType } from '@/data/api/license/type';
import { UserNativeType } from '@/data/api/users/type';
import { useGenerateUrl } from '@/hooks/generate-url/useGenerateUrl';
import { IAM_ACTIONS } from '@/utils/IamAction.constants';

interface ActionButtonUsersProps {
  usersItem: UserNativeType | LicensePrepaidType;
  licenceDetail: LicenseType | LicensePrepaidType;
}
const ActionButtonUsers: React.FC<ActionButtonUsersProps> = ({ usersItem, licenceDetail }) => {
  const { t } = useTranslation(['dashboard/users', NAMESPACES.ACTIONS]);
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
      label: t(`${NAMESPACES.ACTIONS}:edit_account`),
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
            label: t(`${NAMESPACES.ACTIONS}:change_password`),
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
            label: t(`${NAMESPACES.ACTIONS}:delete_account`),
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
