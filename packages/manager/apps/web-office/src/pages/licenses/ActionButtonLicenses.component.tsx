import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu } from '@ovh-ux/muk';

import { APP_NAME, DELETE_ACCOUNT, EDIT_PASSWORD } from '@/Tracking.constants';
import { IAM_ACTIONS } from '@/utils/IamAction.constants';

interface ActionButtonLicensesProps {
  serviceName: string;
  serviceDetailUrl: string;
  mcaUrl: string;
  mcaAgreed: boolean;
}

const ActionButtonLicenses: React.FC<ActionButtonLicensesProps> = ({
  serviceName,
  serviceDetailUrl,
  mcaUrl,
  mcaAgreed,
}) => {
  const { t } = useTranslation(['common', NAMESPACES.ACTIONS]);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();

  const tracking = (action: string) =>
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [action, APP_NAME],
    });
  const handleGoToDetailClick = () => {
    tracking(EDIT_PASSWORD);
    navigate(serviceDetailUrl);
  };

  const handleSignAgreementClick = () => {
    tracking(DELETE_ACCOUNT);
    navigate(mcaUrl);
  };

  const actionItems = [
    ...(!mcaAgreed
      ? [
          {
            id: 1,
            onClick: handleSignAgreementClick,
            label: t('contract_signature'),
          },
        ]
      : []),
    {
      id: 2,
      onClick: handleGoToDetailClick,
      label: t(`${NAMESPACES.ACTIONS}:go_to_details`),
      disabled: !mcaAgreed,
    },
  ];
  return (
    <ActionMenu
      id={serviceName.replace(/@|\./g, '_')}
      items={actionItems}
      variant={BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};

export default ActionButtonLicenses;
