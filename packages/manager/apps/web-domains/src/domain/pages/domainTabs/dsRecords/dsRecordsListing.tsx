import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { Datagrid } from '@ovh-ux/manager-react-components';
import {
  Button,
  BUTTON_SIZE,
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';
import { Outlet, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDomainDsRecordsDatagridColumns } from '@/domain/hooks/domainTabs/useDomainDsRecordsDatagridColumns';
import {
  useGetDomainResource,
  useGetDomainZone,
} from '@/domain/hooks/data/query';
import { TDsDataInterface } from '@/domain/types/dnssecConfiguration';
import { StatusEnum } from '@/domain/enum/Status.enum';
import {
  areDsRecordsEqual,
  getSupportedAlgorithm,
  isDsRecordActionDisabled,
} from '@/domain/utils/utils';
import { DrawerBehavior } from '@/common/types/common.types';
import { DrawerActionEnum } from '@/common/enum/common.enum';
import DsRecordsDrawer from '@/domain/components/DsRecords/DsRecordsDrawer';
import { computeActiveConfiguration } from '@/domain/utils/dnsUtils';
import { flagsValue } from '@/domain/constants/dsRecords';

export default function DsRecordsListing() {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const { serviceName } = useParams();
  const { domainResource } = useGetDomainResource(serviceName);
  const { domainZone, isFetchingDomainZone } = useGetDomainZone(serviceName);
  const [items, setItems] = useState<TDsDataInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [drawer, setDrawer] = useState<DrawerBehavior>({
    isOpen: false,
    action: null,
  });
  const [dsRecordsData, setDsRecordsData] = useState<TDsDataInterface>({
    keyTag: null,
    flags: flagsValue,
    algorithm:
      domainResource?.currentState?.dnssecConfiguration?.dsData[0]?.algorithm ??
      0,
    publicKey: '',
  });

  useEffect(() => {
    const {
      dsData: dsRecordCurrentState,
      supportedAlgorithms,
    } = domainResource?.currentState.dnssecConfiguration;
    const {
      dsData: dsRecordTargetSpec,
    } = domainResource?.targetSpec?.dnssecConfiguration;

    if (!dsRecordCurrentState.length && !dsRecordTargetSpec.length) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    const makeKey = (ds: TDsDataInterface) => `${ds.keyTag}-${ds.algorithm}`;

    const targetMap = new Map(
      dsRecordTargetSpec.map((ds) => [makeKey(ds), ds] as const),
    );

    const currentWithStatus: TDsDataInterface[] = dsRecordCurrentState.map(
      (current) => {
        const key = makeKey(current);
        const target = targetMap.get(key);

        if (!target) {
          return {
            ...current,
            supportedAlgorithm: getSupportedAlgorithm(
              current.algorithm,
              supportedAlgorithms,
            ),
            status: StatusEnum.DELETING,
          };
        }

        const isEqual = areDsRecordsEqual(current, target);
        targetMap.delete(key);

        return {
          ...current,
          supportedAlgorithm: getSupportedAlgorithm(
            current.algorithm,
            supportedAlgorithms,
          ),
          status: isEqual ? StatusEnum.ENABLED : StatusEnum.UPDATING,
        };
      },
    );

    const activatingDs: TDsDataInterface[] = Array.from(targetMap.values()).map(
      (target) => ({
        ...target,
        supportedAlgorithm: getSupportedAlgorithm(
          target.algorithm,
          supportedAlgorithms,
        ),
        status: StatusEnum.ACTIVATING,
      }),
    );

    setItems([...currentWithStatus, ...activatingDs]);
    setIsLoading(false);
  }, [domainResource]);

  const activeConfiguration = computeActiveConfiguration(
    domainResource,
    domainZone,
  );

  const columns = useDomainDsRecordsDatagridColumns({
    setDrawer,
    setDsRecordsData,
    activeConfiguration,
  });

  return (
    <div data-testid="datagrid">
      <Datagrid
        columns={columns}
        items={items}
        totalItems={items.length}
        isLoading={isLoading || isFetchingDomainZone}
        topbar={
          <div className="flex flex-col gap-y-6 items-start">
            {isDsRecordActionDisabled(activeConfiguration) ? (
              <Message
                color={MESSAGE_COLOR.information}
                dismissible={false}
                className="w-full"
              >
                <MessageIcon name={ICON_NAME.circleInfo} />
                <MessageBody>
                  {t('domain_tab_dsrecords_actions_disabled')}
                </MessageBody>
              </Message>
            ) : (
              <Button
                size={BUTTON_SIZE.sm}
                data-testid="addButton"
                onClick={() =>
                  setDrawer({
                    isOpen: true,
                    action: DrawerActionEnum.Add,
                  })
                }
              >
                {t(`${NAMESPACES.ACTIONS}:add`)}
              </Button>
            )}
          </div>
        }
      />
      <DsRecordsDrawer
        drawer={drawer}
        serviceName={serviceName}
        targetSpec={domainResource.targetSpec}
        checksum={domainResource.checksum}
        setDrawer={setDrawer}
        supportedAlgorithms={
          domainResource.currentState.dnssecConfiguration.supportedAlgorithms
        }
        dsRecordsData={dsRecordsData}
      />
      <Outlet />
    </div>
  );
}
