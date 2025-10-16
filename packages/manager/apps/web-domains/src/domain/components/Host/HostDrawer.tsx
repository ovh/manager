import { Dispatch, SetStateAction, useMemo } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Drawer } from '@ovh-ux/manager-react-components';
import { Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { DrawerActionEnum } from '@/domain/enum/hostConfiguration.enum';
import HostForm from './HostForm';
import { getIpsSupported } from '@/domain/utils/utils';

interface HostDrawerProps {
  readonly drawerAction: DrawerActionEnum;
  readonly formData: { host: string; ips: string[] };
  readonly drawer: { isOpen?: boolean; action?: DrawerActionEnum };
  readonly setFormData: Dispatch<
    SetStateAction<{ host?: string; ips?: string[] }>
  >;
  readonly setDrawer: Dispatch<
    SetStateAction<{ isOpen?: boolean; action?: DrawerActionEnum }>
  >;
  readonly ipv4Supported: boolean;
  readonly ipv6Supported: boolean;
  readonly multipleIPsSupported: boolean;
}

export default function HostDrawer({
  drawerAction,
  formData,
  drawer,
  ipv4Supported,
  ipv6Supported,
  multipleIPsSupported,
  setDrawer,
  setFormData,
}: HostDrawerProps) {
  const { t } = useTranslation('domain');
  const [hostName] = formData.host.split('.');
  const ipsSupported = useMemo(
    () => getIpsSupported(ipv4Supported, ipv6Supported, multipleIPsSupported),

    [ipv4Supported, ipv6Supported, multipleIPsSupported],
  );
  return (
    <Drawer
      heading={
        drawerAction === DrawerActionEnum.Add
          ? t('domain_tab_hosts_drawer_add_title')
          : t('domain_tab_hosts_drawer_modify_title')
      }
      onDismiss={() => {
        setDrawer({
          isOpen: false,
        });
        setFormData({ host: '', ips: [] });
      }}
      isOpen={drawer.isOpen}
      primaryButtonLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      secondaryButtonLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={() => {
        setDrawer({
          isOpen: false,
        });

        setFormData({ host: '', ips: [] });
      }}
    >
      <Text className="mb-6">
        {t(`${NAMESPACES.FORM}:error_required_fields`)}
      </Text>

      <HostForm
        drawerAction={DrawerActionEnum.Add}
        formData={formData}
        setFormData={setFormData}
        ipsSupported={ipsSupported}
        hostName={hostName}
      />
    </Drawer>
  );
}
