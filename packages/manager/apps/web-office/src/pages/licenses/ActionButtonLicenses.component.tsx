import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu } from '@ovh-ux/muk';

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
  const navigate = useNavigate();

  const handleGoToDetailClick = () => {
    navigate(serviceDetailUrl);
  };

  const handleSignAgreementClick = () => {
    navigate(mcaUrl);
  };

  const actionItems = [
    ...(!mcaAgreed
      ? [
          {
            id: 1,
            onClick: handleSignAgreementClick,
            label: t('contract_signature'),
            iamActions: [IAM_ACTIONS.mca.createAttestation],
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
