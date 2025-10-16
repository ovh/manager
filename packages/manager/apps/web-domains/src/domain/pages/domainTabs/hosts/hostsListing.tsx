import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid } from '@ovh-ux/manager-react-components';
import {
  Button,
  BUTTON_SIZE,
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  Text,
  TEXT_PRESET,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useHostsDatagridColumns } from '@/domain/hooks/domainTabs/useHostsDatagridColumns';
import { useGetDomainResource } from '@/domain/hooks/data/query';
import { StatusEnum } from '@/domain/enum/Status.enum';
import { DrawerActionEnum } from '@/domain/enum/hostConfiguration.enum';
import HostDrawer from '@/domain/components/Host/HostDrawer';
import { THost } from '@/domain/types/host';
import Loading from '@/domain/components/Loading/Loading';
import { useNichandleInformation } from '@/common/hooks/nichandle/useNichandleInformation';

export default function HostsListingTab() {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const [hostsArray, setHostsArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { serviceName } = useParams<{ serviceName: string }>();

  const [drawer, setDrawer] = useState<{
    isOpen: boolean;
    action?: DrawerActionEnum;
  }>({
    isOpen: false,
  });

  const [formData, setFormData] = useState<THost>({
    host: '',
    ips: [],
  });

  const { domainResource } = useGetDomainResource(serviceName);
  const { nichandleInformation } = useNichandleInformation();

  useEffect(() => {
    const hostsCurrentState =
      domainResource?.currentState?.hostsConfiguration?.hosts || [];
    const hostsTargetSpec =
      domainResource?.targetSpec?.hostsConfiguration?.hosts || [];

    const targetMap = new Map(hostsTargetSpec.map((h) => [h.host, h]));

    const hostsWithStatus = hostsCurrentState.map((current) => {
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
        status: ipsEqual ? StatusEnum.ENABLED : StatusEnum.UPDATING,
      };
    });

    const activatingHosts = Array.from(targetMap.values()).map((target) => ({
      ...target,
      status: StatusEnum.ACTIVATING,
    }));

    setHostsArray([...hostsWithStatus, ...activatingHosts]);
    setIsLoading(false);
  }, [domainResource]);

  const columns = useHostsDatagridColumns();

  if (isLoading && nichandleInformation) {
    return <Loading />;
  }

  const account = nichandleInformation?.auth?.account;
  const {
    id,
  } = domainResource?.currentState?.contactsConfiguration?.contactAdministrator;

  return id !== account ? (
    <Message
      color={MESSAGE_COLOR.warning}
      className="w-full"
      data-testid="warningMessage"
    >
      <MessageIcon name={ICON_NAME.triangleExclamation} />
      <MessageBody>
        <Text preset={TEXT_PRESET.heading6}>
          {t('domain_tab_hosts_listing_warning_title')}
        </Text>
        <Text>{t('domain_tab_hosts_listing_warning_sub_1')}</Text>
        <Text>{t('domain_tab_hosts_listing_warning_sub_2')}</Text>
      </MessageBody>
    </Message>
  ) : (
    <section>
      <div className="flex flex-col gap-y-4 mb-6">
        <Message>
          <MessageIcon name={ICON_NAME.circleInfo} />
          <MessageBody>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget
            maximus leo, ac rutrum mi. Quisque auctor augue nec est pulvinar, ut
            iaculis elit placerat. Curabitur facilisis libero et nisi consequat
            lacinia nec eget turpis. Mauris congue varius lorem sit amet
            malesuada. Vestibulum ac metus nisi.
          </MessageBody>
        </Message>
      </div>

      <div data-testid="datagrid">
        <Datagrid
          columns={columns}
          items={hostsArray}
          totalItems={hostsArray.length}
          topbar={
            <Button
              className="mb-6"
              size={BUTTON_SIZE.sm}
              onClick={() =>
                setDrawer({
                  isOpen: true,
                  action: DrawerActionEnum.Add,
                })
              }
              data-testid="addButton"
            >
              {t(`${NAMESPACES.ACTIONS}:add`)}
            </Button>
          }
        />
      </div>

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
        serviceName={serviceName}
        checksum={domainResource?.checksum}
        hostsTargetSpec={domainResource?.targetSpec.hostsConfiguration.hosts}
      />
    </section>
  );
}
