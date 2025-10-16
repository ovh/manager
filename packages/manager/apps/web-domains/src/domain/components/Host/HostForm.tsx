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
import { Dispatch, SetStateAction, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DrawerActionEnum,
  IpsSupportedEnum,
} from '@/domain/enum/hostConfiguration.enum';
import HostIpsSupportedMessage from '@/domain/components/Host/HostIpsSupportedMessage';
import { getHostnameErrorMessage, isIpsInvalid } from '@/domain/utils/utils';
import { THost } from '@/domain/types/host';

interface HostFormProps {
  readonly drawerAction: DrawerActionEnum;
  readonly formData: { host: string; ips: string[] };
  readonly setFormData: Dispatch<
    SetStateAction<{ host: string; ips: string[] }>
  >;
  readonly ipsSupported: IpsSupportedEnum;
  readonly error: { errorHost: string; errorIps: boolean };
  readonly setError: Dispatch<
    SetStateAction<{ errorHost: string; errorIps: boolean }>
  >;
  readonly serviceName: string;
  readonly hostsTargetSpec: THost[];
}

export default function HostForm({
  drawerAction,
  formData,
  ipsSupported,
  error,
  serviceName,
  hostsTargetSpec,
  setError,
  setFormData,
}: HostFormProps) {
  const { t } = useTranslation('domain');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTime = 700;

  return (
    <section className="flex flex-col gap-y-6" data-testid="host-form">
      <div className="flex flex-col gap-y-6">
        <FormField
          invalid={
            error.errorHost ===
              'domain_tab_hosts_drawer_add_invalid_host_same' ||
            error.errorHost ===
              'domain_tab_hosts_drawer_add_invalid_host_format'
          }
        >
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
              value={formData.host}
              onChange={(e) => {
                const { value } = e.target;
                setFormData((prev) => ({ ...prev, host: value }));

                if (timerRef.current) {
                  clearTimeout(timerRef.current);
                }

                timerRef.current = setTimeout(() => {
                  const errorKey = getHostnameErrorMessage(
                    value,
                    serviceName,
                    hostsTargetSpec,
                  );
                  setError((prev) => ({
                    ...prev,
                    errorHost: value === '' ? '' : errorKey,
                  }));
                }, debounceTime);
              }}
            />

            <FormFieldError className="text-sm">
              {error.errorHost ? t(error.errorHost) : null}
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
            value={formData.ips}
            onChange={(e) => {
              const { value } = e.target;

              const ips = value.split(',').map((ip) => ip.trim());
              setFormData((prev) => ({
                ...prev,
                ips,
              }));
              if (timerRef.current) {
                clearTimeout(timerRef.current);
              }
              timerRef.current = setTimeout(() => {
                const errorIps = isIpsInvalid(ips, ipsSupported);
                setError({
                  ...error,
                  errorIps: ips.length === 0 ? false : errorIps,
                });
              }, debounceTime);
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
