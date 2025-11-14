import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Drawer, useNotifications } from '@ovh-ux/manager-react-components';
import { Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { DrawerActionEnum } from '@/domain/enum/hostConfiguration.enum';
import HostForm from './HostForm';
import { getIpsSupported } from '@/domain/utils/utils';
import { THost } from '@/domain/types/host';
import { useUpdateDomainResource } from '@/domain/hooks/data/query';

interface HostDrawerProps {
  readonly drawerAction: DrawerActionEnum;
  readonly formData: THost;
  readonly drawer: { isOpen?: boolean; action?: DrawerActionEnum };
  readonly setFormData: Dispatch<SetStateAction<THost>>;
  readonly setDrawer: Dispatch<
    SetStateAction<{ isOpen?: boolean; action?: DrawerActionEnum }>
  >;
  readonly ipv4Supported: boolean;
  readonly ipv6Supported: boolean;
  readonly multipleIPsSupported: boolean;
  readonly serviceName: string;
  readonly checksum: string;
  readonly hostsTargetSpec: THost[];
}

export default function HostDrawer({
  drawerAction,
  formData,
  drawer,
  ipv4Supported,
  ipv6Supported,
  multipleIPsSupported,
  serviceName,
  checksum,
  hostsTargetSpec,
  setDrawer,
  setFormData,
}: HostDrawerProps) {
  const { t } = useTranslation('domain');
  const [error, setError] = useState<{
    errorHost?: boolean;
    errorIps?: boolean;
  }>({
    errorHost: false,
    errorIps: false,
  });
  const ipsSupported = useMemo(
    () => getIpsSupported(ipv4Supported, ipv6Supported, multipleIPsSupported),
    [ipv4Supported, ipv6Supported, multipleIPsSupported],
  );
  const { updateDomain, isUpdateDomainPending } = useUpdateDomainResource(
    serviceName,
  );
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const onDismiss = () => {
    setDrawer({
      isOpen: false,
    });
    setFormData({ host: '', ips: [] });
    setError({ errorHost: false, errorIps: false });
  };

  return (
    <Drawer
      heading={
        drawerAction === DrawerActionEnum.Add
          ? t('domain_tab_hosts_drawer_add_title')
          : t('domain_tab_hosts_drawer_modify_title')
      }
      onDismiss={() => onDismiss()}
      isOpen={drawer.isOpen}
      primaryButtonLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      isPrimaryButtonDisabled={
        formData.host === '' ||
        formData.ips.length === 0 ||
        error.errorHost === true ||
        error.errorIps === true
      }
      secondaryButtonLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onPrimaryButtonClick={async () => {
        updateDomain(
          {
            checksum,
            hosts: [
              ...hostsTargetSpec,
              {
                host:
                  drawerAction === DrawerActionEnum.Add
                    ? `${formData.host}.${serviceName}`
                    : formData.host,
                ips: formData.ips,
              },
            ],
          },
          {
            onSuccess: () => {
              addSuccess(
                t('domain_tab_hosts_drawer_add_success_message', {
                  host: `${formData.host}.${serviceName}`,
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
      }}
      isPrimaryButtonLoading={isUpdateDomainPending}
      onSecondaryButtonClick={() => onDismiss()}
      data-testid="drawer"
    >
      <Text className="mb-6">
        {t(`${NAMESPACES.FORM}:error_required_fields`)}
      </Text>

      <HostForm
        drawerAction={drawerAction}
        formData={formData}
        setFormData={setFormData}
        ipsSupported={ipsSupported}
        error={error}
        setError={setError}
        serviceName={serviceName}
        hostsTargetSpec={hostsTargetSpec}
      />
    </Drawer>
  );
}
