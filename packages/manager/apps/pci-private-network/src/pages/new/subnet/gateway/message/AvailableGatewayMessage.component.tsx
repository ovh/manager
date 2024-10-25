import React from 'react';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_MESSAGE_TYPE,
} from '@ovhcloud/ods-components';
import { useTranslation, Trans } from 'react-i18next';

type Props = {
  region: string;
  size: string;
  monthlyPrice: string;
  hourlyPrice: string;
};

const AvailableGatewayMessage: React.FC<Props> = ({
  region,
  size,
  monthlyPrice,
  hourlyPrice,
}) => {
  const { t } = useTranslation('new');

  return (
    <OsdsMessage data-testid="gateway-catalog" type={ODS_MESSAGE_TYPE.warning}>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
      >
        {t(
          'pci_projects_project_network_private_create_summary_step_missing_components_description',
        )}
        <br />
        {t(
          'pci_projects_project_network_private_create_summary_step_gateway_name',
          { region },
        )}
        <br />
        <Trans
          t={t}
          i18nKey="pci_projects_project_network_private_create_summary_step_gateway_size_and_price"
          values={{ size }}
        />
        <Trans
          t={t}
          i18nKey="pci_projects_project_network_private_create_summary_step_price"
          values={{
            monthlyPrice,
            hourlyPrice,
          }}
        />
      </OsdsText>
    </OsdsMessage>
  );
};

export default React.memo(AvailableGatewayMessage);
