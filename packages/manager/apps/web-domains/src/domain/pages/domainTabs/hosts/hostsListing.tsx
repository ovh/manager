import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid } from '@ovh-ux/manager-react-components';
import { Button, BUTTON_SIZE, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useHostsDatagridColumns } from '@/domain/hooks/domainTabs/useHostsDatagridColumns';
import { useGetDomainResource } from '@/domain/hooks/data/query';
import { StatusEnum } from '@/domain/enum/Status.enum';
import { DrawerActionEnum } from '@/domain/enum/hostConfiguration.enum';
import HostDrawer from '@/domain/components/Host/HostDrawer';

export default function HostsListing() {
  const params = useParams();
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const [hostsArray, setHostsArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const { domainResource } = useGetDomainResource(params.serviceName);

  useEffect(() => {
    const hostsCurrentState =
      domainResource.currentState.hostsConfiguration.hosts || [];
    const hostsTargetSpec =
      domainResource.targetSpec.hostsConfiguration.hosts || [];

    const targetMap = new Map(hostsTargetSpec.map((h) => [h.host, h]));

    const arrayWithStatus = hostsCurrentState.map((current) => {
      const target = targetMap.get(current.host);

      if (!target) {
        return { ...current, status: StatusEnum.DELETING };
      }

      const ipsEqual =
        current.ips.length === target.ips.length &&
        current.ips.every((ip) => target.ips.includes(ip));

      targetMap.delete(current.host);

      return {
        ...current,
        status: ipsEqual ? StatusEnum.ENABLED : 'updating',
      };
    });

    const activatingHosts = Array.from(targetMap.values()).map((target) => ({
      ...target,
      status: StatusEnum.ACTIVATING,
    }));

    setHostsArray([...arrayWithStatus, ...activatingHosts]);
    setIsLoading(false);
  }, [domainResource]);

  const columns = useHostsDatagridColumns({ setDrawer, setFormData });

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
        items={hostsArray}
        totalItems={hostsArray.length}
        isLoading={isLoading}
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

      <HostDrawer
        drawerAction={DrawerActionEnum.Add}
        formData={formData}
        drawer={drawer}
        setFormData={setFormData}
        setDrawer={setDrawer}
        ipv4Supported={
          domainResource?.currentState?.hostsConfiguration.ipv4Supported
        }
        ipv6Supported={
          domainResource?.currentState?.hostsConfiguration.ipv6Supported
        }
        multipleIPsSupported={
          domainResource?.currentState?.hostsConfiguration.multipleIPsSupported
        }
      />
    </section>
  );
}
