import {
  Button,
  BUTTON_COLOR,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  FormField,
  FormFieldLabel,
  Icon,
  ICON_NAME,
  Input,
} from '@ovhcloud/ods-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ipaddr from 'ipaddr.js';
import { TNameServer } from '@/domain/types/domainResource';
import { isInternalDns } from '@/domain/utils/dnsUtils';

interface DnsLineInputProps {
  readonly server: string;
  readonly ip?: string;
  readonly showLabels?: boolean;
  readonly onRemove?: () => void;
  readonly onAdd?: (values: { server: string; ip: string }) => void;
  readonly editable: boolean;
  readonly allServers: TNameServer[];
}

export default function DnsLineInput({
  server,
  ip,
  showLabels = false,
  onRemove,
  onAdd,
  editable,
  allServers,
}: DnsLineInputProps) {
  const { t } = useTranslation('domain');

  const [serverValue, setServerValue] = useState(server);
  const [ipValue, setIpValue] = useState(ip);

  const [serverError, setServerError] = useState<'format' | 'duplicate' | null>(
    null,
  );
  const [ipError, setIpError] = useState(false);
  const [isInternalDnsError, setIsInternalDnsError] = useState(false);

  const dnsRegex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

  const validateServer = () => {
    const trimmed = serverValue.trim();
    if (!trimmed) {
      setServerError(null);
      setIsInternalDnsError(false);
      return;
    }
    if (!dnsRegex.test(trimmed)) {
      setServerError('format');
      setIsInternalDnsError(false);
      return;
    }

    const isDuplicate = allServers.some((ns) => ns.nameServer === trimmed);
    if (isDuplicate) {
      setServerError('duplicate');
      setIsInternalDnsError(false);
      return;
    }
    if (isInternalDns(trimmed)) {
      setIsInternalDnsError(true);
      return;
    }
    setServerError(null);
    setIsInternalDnsError(false);
  };

  const validateIp = () => {
    if (!ipValue) {
      setIpError(false);
      return;
    }
    const isValid = ipaddr.isValid(ipValue);
    setIpError(!isValid);
  };

  const handleAdd = () => {
    validateServer();
    validateIp();

    if (serverError !== null || ipError || isInternalDnsError) return;

    onAdd?.({
      server: serverValue.trim(),
      ip: ipValue.trim(),
    });

    setServerValue('');
    setIpValue('');
    setServerError(null);
    setIpError(false);
  };

  return (
    <div className="flex flex-row gap-6 w-full mb-4">
      <FormField className="flex-1">
        {showLabels && (
          <div>
            <FormFieldLabel className="text-sm">
              {t('domain_tab_DNS_modification_form_server_field')}
            </FormFieldLabel>
            {editable && (
              <FormFieldLabel className="text-xs font-normal">
                {t('domain_tab_DNS_modification_form_server_field_mandatory')}
              </FormFieldLabel>
            )}
          </div>
        )}
        <Input
          value={serverValue}
          onChange={(e) => {
            setServerValue(e.target.value);
            setServerError(null);
          }}
          onBlur={validateServer}
          invalid={serverError !== null}
          placeholder={t('domain_tab_DNS_modification_form_placeholder')}
          className="w-full"
          readOnly={!editable}
          disabled={!editable}
        />
        {serverError === 'format' && (
          <p className="text-[--ods-color-critical-500] text-xs mt-1">
            {t('domain_tab_DNS_modification_form_server_wrong_format')}
          </p>
        )}
        {serverError === 'duplicate' && (
          <p className="text-[--ods-color-critical-500] text-xs mt-1">
            {t('domain_tab_DNS_modification_form_server_already_used')}
          </p>
        )}
        {isInternalDnsError && (
          <p className="text-[--ods-color-critical-500] text-xs mt-1">
            {t('domain_tab_DNS_modification_form_internal_server_error')}
          </p>
        )}
      </FormField>
      <FormField className="flex-1">
        {showLabels && (
          <div>
            <FormFieldLabel className="text-sm">
              {t('domain_tab_DNS_modification_form_ip_field')}
            </FormFieldLabel>
          </div>
        )}
        <div className="flex flex-row gap-4 items-center">
          <Input
            value={ipValue}
            onChange={(e) => {
              setIpValue(e.target.value);
              setIpError(false);
            }}
            onBlur={validateIp}
            placeholder={
              !editable
                ? ''
                : t('domain_tab_DNS_modification_form_placeholder_ip')
            }
            className="flex-1"
            invalid={ipError}
            readOnly={!editable}
            disabled={!editable}
          />
          {editable ? (
            <Button
              variant={BUTTON_VARIANT.outline}
              size={BUTTON_SIZE.sm}
              disabled={
                serverError !== null ||
                ipError ||
                !serverValue.trim() ||
                isInternalDnsError
              }
              onClick={handleAdd}
            >
              {t('domain_tab_DNS_modification_form_add')}
            </Button>
          ) : (
            <Button
              variant={BUTTON_VARIANT.ghost}
              color={BUTTON_COLOR.critical}
              size={BUTTON_SIZE.sm}
              onClick={onRemove}
            >
              <Icon name={ICON_NAME.trash} />
            </Button>
          )}
        </div>
        {ipError && (
          <p className="text-red-700 text-xs mt-1">
            {t('domain_tab_DNS_modification_form_ip_wrong_format')}
          </p>
        )}
      </FormField>
    </div>
  );
}
