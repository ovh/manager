import {
  OsdsFormField,
  OsdsInput,
  OsdsText,
  OsdsToggle,
} from '@ovhcloud/ods-components/react';
import {
  ODS_INPUT_TYPE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';

import { useEffect, useState } from 'react';
import { GATEWAY_IP_REGEX } from '@/constants';

type GatewayManagementProps = {
  className?: string;
  clusterGateway?: { enabled: boolean; ip: string };
  onUpdated?: (gateway: { enabled: boolean; ip: string }) => void;
  gatewayError: boolean;
};

export default function GatewayManagement({
  className,
  onUpdated,
  clusterGateway,
}: Readonly<GatewayManagementProps>) {
  const { t } = useTranslation('gateway-management');
  const [gateway, setGateway] = useState(clusterGateway);
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    setHasError(
      gateway.ip && RegExp(GATEWAY_IP_REGEX).test(gateway.ip) === false,
    );
  }, [gateway.ip]);
  return (
    <>
      <OsdsFormField className={className}>
        <OsdsText
          slot="label"
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._200}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('kubernetes_add_private_network_gateway_management_label')}
        </OsdsText>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
        >
          {t('kubernetes_add_private_network_gateway_management_description')}
        </OsdsText>
        <OsdsToggle
          className="w-fit mt-4"
          checked={gateway?.enabled || undefined}
          onClick={() => {
            setGateway({ ...gateway, enabled: !gateway.enabled });
            onUpdated({ ...gateway, enabled: !gateway.enabled });
          }}
        >
          <OsdsText
            slot="end"
            color={ODS_TEXT_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            className="pl-4"
            size={ODS_TEXT_SIZE._500}
          >
            {t(
              `kubernetes_add_private_network_gateway_management_gateway_${clusterGateway?.enabled}`,
            )}
          </OsdsText>
        </OsdsToggle>
      </OsdsFormField>
      {gateway.enabled && (
        <OsdsFormField className="mt-4">
          <OsdsInput
            value={gateway?.ip}
            type={ODS_INPUT_TYPE.text}
            onOdsValueChange={(event) => {
              setGateway({ ...gateway, ip: event.detail.value });
              onUpdated({ ...gateway, ip: event.detail.value });
            }}
            error={hasError || undefined}
            className={hasError ? 'bg-red-100' : ''}
            placeholder={t(
              'kubernetes_add_private_network_gateway_management_gateway_vrack_field_ip_placeholder',
            )}
          />
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            className="mt-3"
          >
            {t(
              'kubernetes_add_private_network_gateway_management_gateway_vrack_description',
            )}
          </OsdsText>
        </OsdsFormField>
      )}
    </>
  );
}
