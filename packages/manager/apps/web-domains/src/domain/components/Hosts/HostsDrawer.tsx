import React, { Dispatch, SetStateAction } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  FormField,
  FormFieldHelper,
  FormFieldLabel,
  ICON_NAME,
  Input,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { DrawerActionEnum } from '@/domain/enum/hostConfiguration.enum';

interface HostsDrawerProps {
  readonly drawerAction: DrawerActionEnum;
  readonly formData: { name: string; ips: string[] };
  readonly setFormData: Dispatch<
    SetStateAction<{ name?: string; ips?: string[] }>
  >;
}

export default function HostsDrawer({
  drawerAction,
  formData,
  setFormData,
}: HostsDrawerProps) {
  const { t } = useTranslation(['domain', NAMESPACES.FORM]);
  return (
    <section className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-6">
        <FormField>
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
              readOnly={drawerAction === DrawerActionEnum.Modify}
              name="input"
              className="w-full"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
            <Text
              className={`absolute right-4 bottom-3 pl-3 ${
                drawerAction === DrawerActionEnum.Add
                  ? 'bg-white'
                  : 'bg-[var(--ods-color-neutral-50)]'
              }`}
            >
              @domain.com
            </Text>
          </div>
        </FormField>

        <FormField>
          <FormFieldLabel className="flex gap-x-3">
            <Text preset={TEXT_PRESET.label}>
              {t('domain_tab_hosts_drawer_add_form_hostName_ip')}
            </Text>
            -
            <Text preset={TEXT_PRESET.paragraph}>
              {t(`${NAMESPACES.FORM}:required_field`)}
            </Text>
          </FormFieldLabel>

          <Input
            type="text"
            onChange={(e) => {
              const ipsArray = e.target.value.split(',').map((ip) => ip.trim());
              setFormData((prev) => ({
                ...prev,
                ips: ipsArray,
              }));
            }}
          />

          <FormFieldHelper className="text-[var(--ods-color-text)] text-xs">
            {t('domain_tab_hosts_drawer_add_form_warning_helper_ips')}
          </FormFieldHelper>
          <FormFieldHelper className="text-[var(--ods-color-text)] text-xs">
            {t('domain_tab_hosts_drawer_add_form_warning_helper_multiple_ips')}
          </FormFieldHelper>
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
