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

interface DnsLineInputProps {
  readonly server: string;
  readonly ip?: string;
  readonly showLabels?: boolean;
  readonly onRemove?: () => void;
  readonly onAdd?: (values: { server: string; ip: string }) => void;
  readonly editable: boolean;
}

export default function DnsLineInput({
  server,
  ip,
  showLabels = false,
  onRemove,
  onAdd,
  editable,
}: DnsLineInputProps) {
  const { t } = useTranslation('domain');

  const [serverValue, setServerValue] = useState(server);
  const [ipValue, setIpValue] = useState(ip);

  const [serverError, setServerError] = useState(false);
  const [ipError, setIpError] = useState(false);

  const dnsRegex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;

  const validateServer = (value: string) => {
    if (!value.trim()) {
      setServerError(false);
      return;
    }
    const trimmed = value.trim();
    const isValid = dnsRegex.test(trimmed);
    // const isDuplicate = existingServers.includes(trimmed);
    // setServerError(!isValid || isDuplicate);
    setServerError(!isValid);
  };

  const validateIp = (value: string) => {
    if (!value.trim()) {
      setIpError(false);
      return;
    }
    const isValid = ipv4Regex.test(value.trim());
    setIpError(!isValid);
  };

  const handleServerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setServerValue(value);
    validateServer(value);
  };

  const handleIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setIpValue(value);
    validateIp(value);
  };

  const handleAdd = () => {
    validateServer(serverValue);
    validateIp(ipValue);

    if (serverError || ipError) return;

    onAdd?.({
      server: serverValue.trim(),
      ip: ipValue.trim(),
    });

    setServerValue('');
    setIpValue('');
    setServerError(false);
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
          onChange={handleServerChange}
          invalid={serverError}
          placeholder={t('domain_tab_DNS_modification_form_placeholder')}
          className="w-full"
          readOnly={!editable}
          disabled={!editable}
        />
      </FormField>
      <FormField className="flex-1">
        {showLabels && (
          <FormFieldLabel className="text-sm">
            {t('domain_tab_DNS_modification_form_ip_field')}
          </FormFieldLabel>
        )}
        <div className="flex flex-row gap-4 items-center">
          <Input
            value={ipValue}
            onChange={handleIpChange}
            placeholder={t('domain_tab_DNS_modification_form_placeholder')}
            className="flex-1"
            invalid={ipError}
            readOnly={!editable}
            disabled={!editable}
          />
          {editable ? (
            <Button
              variant={BUTTON_VARIANT.outline}
              size={BUTTON_SIZE.sm}
              disabled={serverError || ipError || !serverValue.trim()}
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
      </FormField>
    </div>
  );
}
