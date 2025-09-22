import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_RADIO_BUTTON_SIZE, ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsFormField,
  OsdsLink,
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import { useProjectUrl } from '@ovh-ux/manager-react-components';

import { GatewayModeSelector, ModeEnum } from './GatewayModeSelector.component';

export const GATEWAY_IP_REGEX = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/;

export interface GatewaySelectorState {
  isEnabled: boolean;
  mode?: ModeEnum;
  ip?: string;
}

export interface GatewaySelectorProps {
  initialValue?: GatewaySelectorState;
  className?: string;
  onSelect?: (state: GatewaySelectorState) => void;
}

const DEFAULT_GATEWAY = {
  isEnabled: false,
  mode: ModeEnum.AUTO,
  ip: '',
};

export const GatewaySelector = ({
  initialValue,
  className,
  onSelect,
}: Readonly<GatewaySelectorProps>) => {
  const [gateway, setGateway] = useState(
    initialValue
      ? {
          ...initialValue,
          mode: initialValue.ip ? ModeEnum.CUSTOM : ModeEnum.AUTO,
        }
      : DEFAULT_GATEWAY,
  );
  const { t: tAdd } = useTranslation('network-add');
  const projectURL = useProjectUrl('public-cloud');
  const gatewaysURL = `${projectURL}/gateway`;

  useEffect(() => {
    onSelect?.({
      ...gateway,
      ip: gateway.mode === ModeEnum.CUSTOM && GATEWAY_IP_REGEX.test(gateway.ip) ? gateway.ip : '',
    });
  }, [gateway]);

  return (
    <OsdsFormField className={className}>
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._200}
        color={ODS_THEME_COLOR_INTENT.text}
        slot="label"
      >
        {tAdd('kubernetes_network_form_gateway_label')}
      </OsdsText>
      <OsdsRadioGroup
        name="gateway"
        value={gateway.isEnabled ? 'true' : 'false'}
        onOdsValueChange={({ detail }) => {
          const isEnabled = detail.newValue === 'true';
          setGateway((gw) => ({
            ...gw,
            isEnabled,
          }));
        }}
      >
        <OsdsRadio name="gateway" value="false">
          <OsdsRadioButton color={ODS_THEME_COLOR_INTENT.primary} size={ODS_RADIO_BUTTON_SIZE.xs}>
            <OsdsText color={ODS_THEME_COLOR_INTENT.text} size={ODS_TEXT_SIZE._400} slot="end">
              {tAdd('kubernetes_network_form_gateway_public')}
            </OsdsText>
          </OsdsRadioButton>
        </OsdsRadio>
        {!gateway.isEnabled && (
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._300}
            color={ODS_THEME_COLOR_INTENT.text}
            className="block mx-9 my-4"
          >
            {tAdd('kubernetes_network_form_gateway_public_description')}
          </OsdsText>
        )}
        <OsdsRadio className="mt-4" name="gateway" value="true">
          <OsdsRadioButton color={ODS_THEME_COLOR_INTENT.primary} size={ODS_RADIO_BUTTON_SIZE.xs}>
            <OsdsText color={ODS_THEME_COLOR_INTENT.text} size={ODS_TEXT_SIZE._400} slot="end">
              {tAdd('kubernetes_network_form_gateway_private')}
            </OsdsText>
          </OsdsRadioButton>
        </OsdsRadio>
        {gateway.isEnabled && (
          <div className="mx-9 my-4">
            <OsdsText
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {tAdd('kubernetes_network_form_gateway_private_description_p1')}
            </OsdsText>
            <OsdsLink
              color={ODS_THEME_COLOR_INTENT.primary}
              className="mx-3"
              href={gatewaysURL}
              target={OdsHTMLAnchorElementTarget._blank}
            >
              {tAdd('kubernetes_network_form_gateway_private_description_link')}
            </OsdsLink>
            <OsdsText
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {tAdd('kubernetes_network_form_gateway_private_description_p2')}
            </OsdsText>
          </div>
        )}
      </OsdsRadioGroup>
      {gateway.isEnabled && (
        <GatewayModeSelector
          initialValue={gateway}
          onSelect={(mode, ip) => {
            setGateway((prevValue) => ({
              ...prevValue,
              mode,
              ip,
            }));
          }}
        />
      )}
    </OsdsFormField>
  );
};
