import React, { useState } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid, Drawer } from '@ovh-ux/manager-react-components';
import { Button, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { useHostsDatagridColumns } from '@/domain/hooks/hostsTab/useHostsDatagridColumns';
import HostsDrawer from '@/domain/components/Hosts/HostsDrawer';
import { DrawerActionEnum } from '@/domain/enum/hostConfiguration.enum';

export default function HostConfigurationTab() {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const [drawer, setDrawer] = useState<{
    isOpen: boolean;
    action?: DrawerActionEnum;
  }>({
    isOpen: false,
  });

  const columns = useHostsDatagridColumns({ setDrawer });
  const [formData, setFormData] = useState<{
    name: string;
    ips: string[];
  }>({
    name: '',
    ips: [],
  });

  const updateHost = (
    action: DrawerActionEnum,
    name: string,
    ips: string[],
  ) => {
    console.log('test');
  };

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
        items={[{}]}
        totalItems={0}
        topbar={
          <Button
            className="mb-4"
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
        onDismiss={() =>
          setDrawer({
            isOpen: false,
          })
        }
        isOpen={drawer.isOpen}
        primaryButtonLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
        secondaryButtonLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
        onPrimaryButtonClick={() =>
          updateHost(drawer.action, formData.name, formData.ips)
        }
        onSecondaryButtonClick={() =>
          setDrawer({
            isOpen: false,
          })
        }
      >
        <Text className="mb-6">
          {t(`${NAMESPACES.FORM}:error_required_fields`)}
        </Text>
        <HostsDrawer
          formData={formData}
          setFormData={setFormData}
          drawerAction={drawer.action}
        />
      </Drawer>
      <Outlet />
    </section>
  );
}
