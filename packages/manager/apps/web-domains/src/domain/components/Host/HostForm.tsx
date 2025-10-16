import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  FormField,
  FormFieldLabel,
  Text,
  TEXT_PRESET,
  Input,
  Message,
  MESSAGE_COLOR,
  MessageIcon,
  ICON_NAME,
  MessageBody,
  FormFieldError,
} from '@ovhcloud/ods-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  DrawerActionEnum,
  IpsSupportedEnum,
} from '@/domain/enum/hostConfiguration.enum';
import HostIpsSupportedMessage from '@/domain/components/Host/HostIpsSupportedMessage';
import { isHostnameInvalid, isIpsInvalid } from '@/domain/utils/utils';

interface HostFormProps {
  readonly drawerAction: DrawerActionEnum;
  readonly formData: { host: string; ips: string[] };
  readonly setFormData: Dispatch<
    SetStateAction<{ host?: string; ips?: string[] }>
  >;
  readonly ipsSupported: IpsSupportedEnum;
  readonly error: { errorHost?: boolean; errorIps?: boolean };
  readonly setError: Dispatch<
    SetStateAction<{ errorHost?: boolean; errorIps?: boolean }>
  >;
}

export default function HostForm({
  drawerAction,
  formData,
  ipsSupported,
  error,
  setError,
  setFormData,
}: HostFormProps) {
  const { t } = useTranslation('domain');
  const { serviceName } = useParams();

  return (
    <section className="flex flex-col gap-y-6" data-testid="host-form">
      <div className="flex flex-col gap-y-6">
        <FormField invalid={error.errorHost}>
          <FormFieldLabel className="flex gap-x-3">
            <Text preset={TEXT_PRESET.label} className="text-sm">
              {t('domain_tab_hosts_drawer_add_form_hostName_label')}
            </Text>
            -
            <Text preset={TEXT_PRESET.paragraph} className="text-sm">
              {t(`${NAMESPACES.FORM}:required_field`)}
            </Text>
          </FormFieldLabel>

          <div className="relative">
            <Input
              name="input"
              className="w-full"
              onChange={(e) => {
                const { value } = e.target;
                const debounce = setTimeout(() => {
                  if (isHostnameInvalid(value, serviceName)) {
                    setError({
                      errorHost: true,
                    });
                  } else {
                    setError({
                      errorHost: false,
                    });
                  }
                  setFormData((prev) => ({
                    ...prev,
                    host: value,
                  }));
                }, 300);
                return () => clearTimeout(debounce);
              }}
            />

            <FormFieldError className="text-sm">
              {t('domain_tab_hosts_drawer_add_invalid_host')}
            </FormFieldError>

            <Text
              className={`absolute right-4 pl-3
                ${error.errorHost ? 'bottom-[1.75rem]' : 'bottom-3'}
                 ${
                   drawerAction === DrawerActionEnum.Add
                     ? 'bg-white'
                     : 'bg-[var(--ods-color-neutral-50)]'
                 }`}
            >
              {`.${serviceName}`}
            </Text>
          </div>
        </FormField>

        <FormField invalid={error.errorIps}>
          <FormFieldLabel className="flex gap-x-3">
            <Text preset={TEXT_PRESET.label} className="text-sm">
              {t('domain_tab_hosts_drawer_add_form_hostName_ip')}
            </Text>
            -
            <Text preset={TEXT_PRESET.paragraph} className="text-sm">
              {t(`${NAMESPACES.FORM}:required_field`)}
            </Text>
          </FormFieldLabel>

          <Input
            onChange={(e) => {
              const { value } = e.target;
              const debounce = setTimeout(() => {
                const ips = value.split(',').map((ip) => ip.trim());
                if (isIpsInvalid(ips, ipsSupported)) {
                  setError({
                    errorIps: true,
                  });
                } else {
                  setError({
                    errorIps: false,
                  });
                }
                setFormData((prev) => ({
                  ...prev,
                  ips,
                }));
              }, 700);
              return () => clearTimeout(debounce);
            }}
          />

          <FormFieldError className="text-sm">
            {t('domain_tab_hosts_drawer_add_invalid_ips')}
          </FormFieldError>

          <HostIpsSupportedMessage ipsSupported={ipsSupported} />
        </FormField>
      </div>

      {formData.ips.some((ip) => ip.trim() !== '') && (
        <Message color={MESSAGE_COLOR.warning} dismissible={false}>
          <MessageIcon name={ICON_NAME.triangleExclamation} />
          <MessageBody>
            {t('domain_tab_hosts_drawer_add_form_warning_message')}
            <ul className="m-0 pl-6">
              <li>{t('domain_tab_hosts_drawer_add_form_warning_list_ipv4')}</li>
              <li>{t('domain_tab_hosts_drawer_add_form_warning_list_ipv6')}</li>
            </ul>
          </MessageBody>
        </Message>
      )}
    </section>
  );
}
