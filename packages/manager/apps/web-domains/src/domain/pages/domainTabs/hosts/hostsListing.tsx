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
  Link,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useHostsDatagridColumns } from '@/domain/hooks/domainTabs/useHostsDatagridColumns';
import { useGetDomainResource } from '@/domain/hooks/data/query';
import { StatusEnum } from '@/domain/enum/Status.enum';
import Loading from '@/domain/components/Loading/Loading';
import { useNichandleInformation } from '@/common/hooks/nichandle/useNichandleInformation';

export default function HostsListingTab() {
  const params = useParams();
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const [hostsArray, setHostsArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { domainResource } = useGetDomainResource(params.serviceName);
  const { nichandleInformation } = useNichandleInformation();

  // We compare the current and the targetSpec to add a status. The status depends of the difference between current and target object.
  useEffect(() => {
    // We get hosts array from current and target Specs
    const hostsCurrentState =
      domainResource?.currentState?.hostsConfiguration?.hosts || [];
    const hostsTargetSpec =
      domainResource?.targetSpec?.hostsConfiguration?.hosts || [];

    const targetMap = new Map(hostsTargetSpec.map((h) => [h.host, h]));

    // We check every host in the currentState and compare ips relied to the host.
    const hostsWithStatus = hostsCurrentState.map((current) => {
      const target = targetMap.get(current.host);

      // Host in current but not in targetSpec, we apply the deleting status
      if (!target) {
        return { ...current, status: StatusEnum.DELETING };
      }

      const targetIpsSet = new Set(target.ips);

      const ipsEqual =
        current.ips.length === target.ips.length &&
        current.ips.every((ip) => targetIpsSet.has(ip));

      // Remove from map so remaining entries represent "activating" hosts
      targetMap.delete(current.host);

      return {
        ...current,
        status: ipsEqual ? StatusEnum.ENABLED : StatusEnum.UPDATING,
      };
    });

    // Hosts not present in current but in the targetSpec
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
          <MessageBody className="flex flex-col">
            <Text>{t('domain_tab_hosts_information_banner_1')}</Text>
            <Text>{t('domain_tab_hosts_information_banner_2')}</Text>
            <Link>
              {t('domain_tab_DNS_modification_warning_message_guides')}
            </Link>
          </MessageBody>
        </Message>
      </div>

      <div data-testid="datagrid">
        <Datagrid
          columns={columns}
          items={hostsArray}
          totalItems={hostsArray.length}
          topbar={
            <Button size={BUTTON_SIZE.sm}>
              {t(`${NAMESPACES.ACTIONS}:add`)}
            </Button>
          }
        />
      </div>
    </section>
  );
}
