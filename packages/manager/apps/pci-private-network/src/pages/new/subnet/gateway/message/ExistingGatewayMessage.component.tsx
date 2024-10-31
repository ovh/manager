import React from 'react';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';

const ExistingGatewayMessage: React.FC<{ gateway: string }> = ({ gateway }) => {
  const { t } = useTranslation('new');

  return (
    <OsdsMessage
      data-testid={`gateway-${gateway}`}
      type={ODS_MESSAGE_TYPE.info}
    >
      <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
        {t(
          'pci_projects_project_network_private_create_summary_step_gateway_available',
          { gateway },
        )}
      </OsdsText>
    </OsdsMessage>
  );
};

export default React.memo(ExistingGatewayMessage);
