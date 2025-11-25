import { Dispatch, SetStateAction, useMemo } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Drawer, useNotifications } from '@ovh-ux/manager-react-components';
import { Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { DrawerActionEnum } from '@/domain/enum/hostConfiguration.enum';
import HostForm from './HostForm';
import {
  getIpsSupported,
  tranformIpsStringToArray,
} from '@/domain/utils/utils';
import { useUpdateDomainResource } from '@/domain/hooks/data/query';
import { TDomainResource } from '@/domain/types/domainResource';
import { FormProvider, useForm } from 'react-hook-form';

interface HostDrawerProps {
  readonly drawer: { isOpen: boolean; action: DrawerActionEnum };
  readonly setDrawer: Dispatch<
    SetStateAction<{ isOpen: boolean; action: DrawerActionEnum }>
  >;
  readonly ipv4Supported: boolean;
  readonly ipv6Supported: boolean;
  readonly multipleIPsSupported: boolean;
  readonly serviceName: string;
  readonly checksum: string;
  readonly targetSpec: TDomainResource['targetSpec'];
}

export default function HostDrawer({
  drawer,
  ipv4Supported,
  ipv6Supported,
  multipleIPsSupported,
  serviceName,
  checksum,
  targetSpec,
  setDrawer,
}: HostDrawerProps) {
  const { t } = useTranslation('domain');
  const { updateDomain, isUpdateDomainPending } = useUpdateDomainResource(
    serviceName,
  );
  const { addError, addSuccess, clearNotifications } = useNotifications();

  const ipsSupported = getIpsSupported(
    ipv4Supported,
    ipv6Supported,
    multipleIPsSupported,
  );

  const formData = useForm({
    mode: 'onChange',
    defaultValues: {
      host: '',
      ips: '',
    },
  });
  const { handleSubmit, formState, reset, clearErrors } = formData;

  const onDismiss = () => {
    setDrawer({
      isOpen: false,
      action: null,
    });
    reset({
      host: '',
      ips: '',
    });
    clearErrors();
  };

  const { hostsConfiguration, dnsConfiguration } = targetSpec;

  return (
    <Drawer
      data-testid="drawer"
      heading={
        drawer.action === DrawerActionEnum.Add
          ? t('domain_tab_hosts_drawer_add_title')
          : t('domain_tab_hosts_drawer_modify_title')
      }
      onDismiss={() => onDismiss()}
      isOpen={drawer.isOpen}
      primaryButtonLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      isPrimaryButtonLoading={isUpdateDomainPending}
      isPrimaryButtonDisabled={!formState.isValid}
      secondaryButtonLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={() => onDismiss()}
      onPrimaryButtonClick={handleSubmit((values) => {
        updateDomain(
          {
            checksum,
            nameServers: dnsConfiguration.nameServers,
            hosts: [
              ...hostsConfiguration.hosts,
              {
                host: `${values.host}.${serviceName}`,
                ips: tranformIpsStringToArray(values.ips),
              },
            ],
          },
          {
            onSuccess: () => {
              addSuccess(
                t('domain_tab_hosts_drawer_add_success_message', {
                  host: `${values.host}.${serviceName}`,
                }),
              );
            },
            onError: (e) => {
              addError(
                t('domain_tab_hosts_drawer_add_error_message', {
                  error: e,
                }),
              );
            },
            onSettled: () => {
              clearNotifications();
              onDismiss();
            },
          },
        );
      })}
    >
      <Text className="mb-6">
        {t(`${NAMESPACES.FORM}:error_required_fields`)}
      </Text>

      <FormProvider {...formData}>
        <HostForm
          drawerAction={drawer.action}
          ipsSupported={ipsSupported}
          serviceName={serviceName}
          hostsTargetSpec={targetSpec.hostsConfiguration.hosts}
        />
      </FormProvider>
    </Drawer>
  );
}
