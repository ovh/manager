import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

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

export const GATEWAY_IP_REGEX = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/;

export enum ModeEnum {
  CUSTOM = 'custom',
  AUTO = 'auto',
}
export interface GatewayModeSelectorState {
  mode?: ModeEnum;
  ip?: string;
}

export interface GatewaySelectorProps {
  initialValue?: GatewayModeSelectorState;
  onSelect?: (mode: ModeEnum, ip: string) => void;
}

export const GatewayModeSelector = ({ initialValue, onSelect }: Readonly<GatewaySelectorProps>) => {
  const { t: tAdd } = useTranslation('network-add');

  const [gatewayMode, setGatewayMode] = useState(initialValue?.mode || ModeEnum.AUTO);

  const [gatewayIp, setGatewayIp] = useState({
    isTouched: false,
    hasError: false,
    value: initialValue?.ip || '',
  });

  useEffect(() => {
    onSelect(gatewayMode, gatewayIp.value);
  }, []);

  useEffect(() => {
    setGatewayIp({
      ...gatewayIp,
      hasError: gatewayIp.isTouched && !GATEWAY_IP_REGEX.test(gatewayIp.value),
    });
  }, [gatewayIp.value, gatewayIp.isTouched]);

  return (
    <>
      <OsdsRadioGroup
        className="block mt-4 ml-[1.5rem]"
        name="mode"
        value={gatewayMode || ModeEnum.AUTO}
        onOdsValueChange={({ detail }) => {
          const mode = detail.newValue as ModeEnum;
          setGatewayMode(mode);
          onSelect(mode, gatewayIp?.value);
        }}
      >
        <OsdsRadio name="mode" value={ModeEnum.AUTO}>
          <OsdsRadioButton color={ODS_THEME_COLOR_INTENT.primary} size={ODS_RADIO_BUTTON_SIZE.xs}>
            <OsdsText color={ODS_THEME_COLOR_INTENT.text} size={ODS_TEXT_SIZE._400} slot="end">
              {tAdd('kubernetes_network_form_gateway_mode_auto')}
            </OsdsText>
          </OsdsRadioButton>
        </OsdsRadio>
        <OsdsRadio className="mt-4" name="mode" value={ModeEnum.CUSTOM}>
          <OsdsRadioButton color={ODS_THEME_COLOR_INTENT.primary} size={ODS_RADIO_BUTTON_SIZE.xs}>
            <OsdsText color={ODS_THEME_COLOR_INTENT.text} size={ODS_TEXT_SIZE._400} slot="end">
              {tAdd('kubernetes_network_form_gateway_mode_custom')}
            </OsdsText>
          </OsdsRadioButton>
        </OsdsRadio>
      </OsdsRadioGroup>
      {gatewayMode === 'custom' && (
        <OsdsFormField
          className="mt-4 ml-[3rem]"
          error={
            gatewayIp.hasError
              ? tAdd('kubernetes_network_form_gateway_vrack_field_ip_error_pattern')
              : undefined
          }
        >
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.text}
            slot="label"
          >
            {tAdd('kubernetes_network_form_gateway_vrack_field_ip_placeholder')}
          </OsdsText>
          <OsdsInput
            type={ODS_INPUT_TYPE.text}
            color={ODS_THEME_COLOR_INTENT.primary}
            className={gatewayIp.hasError ? 'bg-red-100' : 'bg-white'}
            placeholder={tAdd('kubernetes_network_form_gateway_mode_custom_placeholder')}
            onOdsInputBlur={() => {
              setGatewayIp((ip) => ({
                ...ip,
                isTouched: true,
              }));
            }}
            value={gatewayIp.value}
            onOdsValueChange={(event) => {
              const value = event.target.value.toString();
              setGatewayIp((ip) => ({
                ...ip,
                value,
              }));
              onSelect(gatewayMode, value);
            }}
          />
        </OsdsFormField>
      )}
    </>
  );
};
