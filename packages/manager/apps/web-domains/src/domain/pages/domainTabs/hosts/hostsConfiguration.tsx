import React, { useEffect, useState } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid, Drawer } from '@ovh-ux/manager-react-components';
import { Button, BUTTON_SIZE, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import { useHostsDatagridColumns } from '@/domain/hooks/hostsTab/useHostsDatagridColumns';
import HostsDrawer from '@/domain/components/Hosts/HostsDrawer';
import { DrawerActionEnum } from '@/domain/enum/hostConfiguration.enum';
import { useGetDomainResource } from '@/domain/hooks/data/query';

export default function HostConfigurationTab() {
  const params = useParams();
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const [drawer, setDrawer] = useState<{
    isOpen: boolean;
    action?: DrawerActionEnum;
  }>({
    isOpen: false,
  });

  const [formData, setFormData] = useState<{
    host: string;
    ips: string[];
  }>({
    host: '',
    ips: [],
  });

  const {
    domainResource,
    isFetchingDomainResource,
    domainResourceError,
  } = useGetDomainResource(params.serviceName);

  const columns = useHostsDatagridColumns({ setDrawer, setFormData });

  const updateHost = (
    action: DrawerActionEnum,
    name: string,
    ips: string[],
  ) => {
    console.log('test');
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <section>
      <div className="flex flex-col gap-y-4 mb-6">
        <Text preset={TEXT_PRESET.label}>
          {t('domain_tab_hosts_listing_message_one')}
        </Text>
        <Text preset={TEXT_PRESET.paragraph}>
          {t('domain_tab_hosts_listing_message_two')}
        </Text>
      </div>
      <Datagrid
        columns={columns}
        items={domainResource?.currentState?.hostsConfiguration.hosts}
        totalItems={
          domainResource?.currentState?.hostsConfiguration.hosts.length
        }
        isLoading={isFetchingDomainResource}
        topbar={
          <Button
            className="mb-4"
            size={BUTTON_SIZE.sm}
            onClick={() =>
              setDrawer({
                isOpen: true,
                action: DrawerActionEnum.Add,
              })
            }
          >
            {t(`${NAMESPACES.ACTIONS}:add`)}
          </Button>
        }
      />
      <Drawer
        heading={
          drawer.action === DrawerActionEnum.Add
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
        onPrimaryButtonClick={() =>
          updateHost(drawer.action, formData.host, formData.ips)
        }
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
        <HostsDrawer
          formData={formData}
          setFormData={setFormData}
          drawerAction={drawer.action}
          domainName={params.serviceName}
          ipv4Supported={
            domainResource?.currentState?.hostsConfiguration.ipv4Supported
          }
          ipv6Supported={
            domainResource?.currentState?.hostsConfiguration.ipv6Supported
          }
          multipleIPsSupported={
            domainResource?.currentState?.hostsConfiguration
              .multipleIPsSupported
          }
        />
      </Drawer>
      <Outlet />
    </section>
  );
}
