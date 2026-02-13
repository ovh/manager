import { Dispatch, SetStateAction } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Drawer, useNotifications } from '@ovh-ux/manager-react-components';
import { Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import HostForm from './HostForm';
import {
  getIpsSupported,
  transformIpsStringToArray,
} from '@/domain/utils/utils';
import { useUpdateDomainResource } from '@/domain/hooks/data/query';
import { TDomainResource } from '@/domain/types/domainResource';
import { THost } from '@/domain/types/host';
import { DrawerBehavior } from '@/common/types/common.types';
import { DrawerActionEnum } from '@/common/enum/common.enum';

interface HostDrawerProps {
  readonly drawer: DrawerBehavior;
  readonly setDrawer: Dispatch<SetStateAction<DrawerBehavior>>;
  readonly hostData: THost;
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
  hostData,
  setDrawer,
}: HostDrawerProps) {
  const { t } = useTranslation('domain');
  const { hostsConfiguration } = targetSpec;
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const isAddAction = drawer.action === DrawerActionEnum.Add;
  const { updateDomain, isUpdateDomainPending } = useUpdateDomainResource(
    serviceName,
  );

  const ipsSupported = getIpsSupported(
    ipv4Supported,
    ipv6Supported,
    multipleIPsSupported,
  );

  const formData = useForm({
    mode: 'onChange',
    values: {
      host: isAddAction ? '' : hostData.host.split('.')[0],
      ips: isAddAction ? '' : String(hostData.ips),
    },
  });

  const { handleSubmit, formState, clearErrors, reset } = formData;

  const onDismiss = () => {
    // We added the if here to allow the input to be empty if you re-open the drawer on add mode.
    if (isAddAction) {
      reset({
        host: '',
        ips: '',
      });
    }
    setDrawer({
      isOpen: false,
      action: null,
    });
    clearErrors();
  };

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
      isPrimaryButtonDisabled={!formState.isValid || !formState.isDirty}
      secondaryButtonLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={() => onDismiss()}
      onPrimaryButtonClick={handleSubmit((values) => {
        const newHost = {
          host: `${values.host}.${serviceName}`,
          ips: transformIpsStringToArray(values.ips),
        };
        const updatedHosts = isAddAction
          ? [...hostsConfiguration.hosts, newHost]
          : hostsConfiguration.hosts.map((h) =>
              h.host === hostData.host ? newHost : h,
            );

        updateDomain(
          {
            currentTargetSpec: targetSpec,
            updatedSpec: {
              hostsConfiguration: {
                hosts: updatedHosts,
              },
            },
          },
          {
            onSuccess: () => {
              addSuccess(
                isAddAction
                  ? t('domain_tab_hosts_drawer_add_success_message', {
                      host: `${values.host}.${serviceName}`,
                    })
                  : t('domain_tab_hosts_drawer_modify_success_message', {
                      host: `${values.host}.${serviceName}`,
                    }),
              );
            },
            onError: (e) => {
              addError(
                isAddAction
                  ? t('domain_tab_hosts_drawer_add_error_message', {
                      error: e,
                    })
                  : t('domain_tab_hosts_drawer_add_error_message', {
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
          currentHost={isAddAction ? undefined : hostData.host}
        />
      </FormProvider>
    </Drawer>
  );
}
