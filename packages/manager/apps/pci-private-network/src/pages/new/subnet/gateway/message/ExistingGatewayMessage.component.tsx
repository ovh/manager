import React from 'react';
import {
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { TGateway } from '@/types/gateway.type';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';

const ExistingGatewayMessage: React.FC<{ gateway: TGateway }> = ({
  gateway: { externalInformation, name },
}) => {
  const { t } = useTranslation('new');
  const { setValue } = useFormContext<NewPrivateNetworkForm>();

  return (
    <>
      {!externalInformation ? (
        <>
          <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.warning}>
            <OsdsText color={ODS_TEXT_COLOR_INTENT.text}>
              {t(
                'pci_projects_project_network_private_create_summary_step_gateway_with_snat_disabled',
                { gateway: name },
              )}
            </OsdsText>
          </OsdsMessage>

          <OsdsCheckbox
            onOdsCheckedChange={(event: CustomEvent) =>
              setValue('enableSnat', event.detail.checked)
            }
          >
            <OsdsCheckboxButton
              interactive
              size={ODS_CHECKBOX_BUTTON_SIZE.sm}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              <OsdsText
                color={ODS_TEXT_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._400}
                slot="end"
              >
                {t(
                  'pci_projects_project_network_private_create_summary_step_gateway_enable_snat',
                  {
                    gateway: name,
                  },
                )}
              </OsdsText>
            </OsdsCheckboxButton>
          </OsdsCheckbox>
        </>
      ) : (
        <OsdsMessage
          data-testid={`gateway-${name}`}
          type={ODS_MESSAGE_TYPE.info}
        >
          <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
            {t(
              'pci_projects_project_network_private_create_summary_step_gateway_available',
              { gateway: name },
            )}
          </OsdsText>
        </OsdsMessage>
      )}
    </>
  );
};

export default React.memo(ExistingGatewayMessage);
