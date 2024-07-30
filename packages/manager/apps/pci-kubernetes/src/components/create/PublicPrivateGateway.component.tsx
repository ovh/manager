import { Links, useProjectUrl } from '@ovhcloud/manager-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_INPUT_TYPE,
  ODS_RADIO_BUTTON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsFormField,
  OsdsInput,
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GATEWAY_IP_REGEX } from '@/constants';
import { TFormState } from './NetworkClusterStep.component';

export type PublicPrivateGatewayProps = {
  formState: TFormState;
  setFormState: (formState) => void;
};

export default function PublicPrivateGateway({
  formState,
  setFormState,
}: Readonly<PublicPrivateGatewayProps>) {
  const { t } = useTranslation('network-add');

  const [hasError, setHasError] = useState(false);
  const projectURL = useProjectUrl('public-cloud');
  const gatewayURL = `${projectURL}/gateways`;

  const handleRadioGroupChange = (event) => {
    const gatewayEnabled = event?.detail.newValue === 'true';
    setFormState((prev) => ({
      ...prev,
      gatewayEnabled,
      gatewayIp: gatewayEnabled ? prev.gatewayIp : '',
    }));
    if (!gatewayEnabled) setHasError(false);
  };

  const handleGatewayIpChange = (event) => {
    const gatewayIp = event?.detail.value;
    setFormState((prev) => ({
      ...prev,
      gatewayIp,
    }));
    setHasError(!RegExp(GATEWAY_IP_REGEX).test(gatewayIp));
  };

  return (
    <div>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
        className="block mb-5"
      >
        {t('kubernetes_network_form_gateway_label')}
      </OsdsText>
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('kubernetes_network_form_gateway_description')}
      </OsdsText>

      <div className="my-5">
        <OsdsRadioGroup
          value={`${formState.gatewayEnabled}`}
          onOdsValueChange={handleRadioGroupChange}
        >
          <OsdsRadio value="false">
            <OsdsRadioButton
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_RADIO_BUTTON_SIZE.xs}
            >
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._500}
                slot="end"
              >
                {t('kubernetes_network_form_gateway_public')}
              </OsdsText>
            </OsdsRadioButton>
          </OsdsRadio>
          <OsdsRadio value="true">
            <OsdsRadioButton
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_RADIO_BUTTON_SIZE.xs}
            >
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._500}
                slot="end"
              >
                {t('kubernetes_network_form_gateway_private')}
              </OsdsText>
            </OsdsRadioButton>
          </OsdsRadio>
        </OsdsRadioGroup>
      </div>

      {!formState.gatewayEnabled && (
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
          className="block"
        >
          {t('kubernetes_network_form_gateway_public_description')}
        </OsdsText>
      )}

      {formState.gatewayEnabled && (
        <div>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
          >
            {t('kubernetes_network_form_gateway_private_description_p1')}
          </OsdsText>
          <Links
            className="mx-2"
            label={t(
              'kubernetes_network_form_gateway_private_description_link',
            )}
            href={gatewayURL}
          />
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
          >
            {t('kubernetes_network_form_gateway_private_description_p2')}
          </OsdsText>
          <OsdsFormField
            className="mt-4"
            data-ng-attr-label={t(
              'kubernetes_network_form_gateway_vrack_field_ip_placeholder',
            )}
            error={
              hasError
                ? t(
                    'kubernetes_network_form_gateway_vrack_field_ip_error_pattern',
                  )
                : ''
            }
          >
            <OsdsInput
              id="gatewayIp"
              name="gatewayIp"
              value={formState.gatewayIp}
              type={ODS_INPUT_TYPE.text}
              onOdsValueChange={handleGatewayIpChange}
              className={
                hasError
                  ? 'bg-red-100 border-red-500 text-red-500 focus:text-red-500'
                  : 'border-color-[var(--ods-color-default-200)] bg-white'
              }
              placeholder={t(
                'kubernetes_network_form_gateway_vrack_field_ip_placeholder',
              )}
            />

            {!hasError && (
              <OsdsText
                slot="helper"
                color={ODS_THEME_COLOR_INTENT.primary}
                level={ODS_TEXT_LEVEL.caption}
                size={ODS_TEXT_SIZE._100}
              >
                {t('kubernetes_network_form_gateway_private_description_help')}
              </OsdsText>
            )}
          </OsdsFormField>
        </div>
      )}
    </div>
  );
}
