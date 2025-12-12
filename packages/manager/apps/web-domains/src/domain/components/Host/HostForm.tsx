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
import { useTranslation } from 'react-i18next';
import { IpsSupportedEnum } from '@/domain/enum/hostConfiguration.enum';
import HostIpsSupportedMessage from '@/domain/components/Host/HostIpsSupportedMessage';
import { THost } from '@/domain/types/host';
import { useFormContext } from 'react-hook-form';
import {
  getHostnameErrorMessage,
  getIpsErrorMessage,
  tranformIpsStringToArray,
} from '@/domain/utils/utils';
import { DrawerActionEnum } from '@/common/enum/common.enum';

interface HostFormProps {
  readonly drawerAction: DrawerActionEnum;
  readonly ipsSupported: IpsSupportedEnum;
  readonly serviceName: string;
  readonly hostsTargetSpec: THost[];
}

export default function HostForm({
  drawerAction,
  ipsSupported,
  serviceName,
  hostsTargetSpec,
}: HostFormProps) {
  const { t } = useTranslation('domain');
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const ips = watch('ips');
  const ipsList = tranformIpsStringToArray(ips);

  return (
    <section className="flex flex-col gap-y-6" data-testid="host-form">
      <div className="flex flex-col gap-y-6">
        <FormField className="relative" invalid={Boolean(errors.host)}>
          <FormFieldLabel className="flex gap-x-3">
            <Text preset={TEXT_PRESET.label} className="text-sm">
              {t('domain_tab_hosts_drawer_add_form_hostName_label')}
            </Text>
            -
            <Text preset={TEXT_PRESET.paragraph} className="text-sm">
              {t(`${NAMESPACES.FORM}:required_field`)}
            </Text>
          </FormFieldLabel>

          <Input
            name="host-input"
            className="relative w-full"
            readOnly={drawerAction === DrawerActionEnum.Modify}
            {...register('host', {
              validate: (value: string) => {
                // We use the if to make the error invalid
                if (drawerAction === DrawerActionEnum.Add) {
                  const errorKey = getHostnameErrorMessage(
                    value,
                    serviceName,
                    hostsTargetSpec,
                  );
                  return errorKey ? t(errorKey) : true;
                }
              },
            })}
          />

          <FormFieldError className="text-sm">
            {t(`${errors.host?.message.toString()}`)}
          </FormFieldError>

          <Text
            className={`absolute right-4 pl-3
                  ${errors.host ? 'bottom-[1.75rem]' : 'bottom-3'}
                  ${
                    drawerAction === DrawerActionEnum.Add
                      ? 'bg-white'
                      : 'bg-[var(--ods-color-neutral-50)]'
                  }`}
          >
            {`.${serviceName}`}
          </Text>
        </FormField>

        <FormField invalid={Boolean(errors.ips)}>
          <FormFieldLabel className="flex gap-x-3">
            <Text preset={TEXT_PRESET.label} className="text-sm">
              {t('domain_tab_hosts_drawer_add_form_ip_label')}
            </Text>
            -
            <Text preset={TEXT_PRESET.paragraph} className="text-sm">
              {t(`${NAMESPACES.FORM}:required_field`)}
            </Text>
          </FormFieldLabel>

          <Input
            name="ips-host"
            {...register('ips', {
              validate: (value: string) => {
                const ips = tranformIpsStringToArray(value);
                const errorKey = getIpsErrorMessage(ips, ipsSupported);

                return errorKey ? t(errorKey) : true;
              },
            })}
          />
          <FormFieldError className="text-sm">
            {errors.ips?.message.toString()}
          </FormFieldError>
          <HostIpsSupportedMessage ipsSupported={ipsSupported} />
        </FormField>
      </div>

      {ipsList.length > 0 && ipsList.some((i: string) => i !== '') && (
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
