import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { Datagrid } from '@ovh-ux/manager-react-components';
import { Button, BUTTON_SIZE } from '@ovhcloud/ods-react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDomainDsRecordsDatagridColumns } from '@/domain/hooks/domainTabs/useDomainDsRecordsDatagridColumns';
import { useGetDomainResource } from '@/domain/hooks/data/query';
import { TDsDataInterface } from '@/domain/types/dnssecConfiguration';
import { StatusEnum } from '@/domain/enum/Status.enum';
import { areDsRecordsEqual, getSupportedAlgorithm } from '@/domain/utils/utils';

export default function DsRecordsListing() {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const { serviceName } = useParams();
  const { domainResource } = useGetDomainResource(serviceName);
  const [items, setItems] = useState<TDsDataInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const columns = useDomainDsRecordsDatagridColumns();

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

  return (
    <div data-testid="datagrid">
      <Datagrid
        columns={columns}
        items={items}
        totalItems={items.length}
        isLoading={isLoading}
        topbar={
          <Button size={BUTTON_SIZE.sm}>
            {t(`${NAMESPACES.ACTIONS}:add`)}
          </Button>
        }
      />
    </div>
  );
}
