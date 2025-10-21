import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { Datagrid } from '@ovh-ux/manager-react-components';
import { Button, BUTTON_SIZE } from '@ovhcloud/ods-react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDomainDsRecordsDatagridColumns } from '@/domain/hooks/domainTabs/useDomainDsRecordsDatagridColumns';
import { useGetDomainResource } from '@/domain/hooks/data/query';
import { TDsDataInterface } from '@/domain/types/dnssecConfiguration';
import DsRecordsDrawer from '@/domain/components/DsRecords/DsRecordsDrawer';
import { DrawerInformation } from '@/common/types/common.types';
import { DrawerActionEnum } from '@/common/enum/common.enum';

export default function DsRecordsListing() {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const { serviceName } = useParams();
  const { domainResource } = useGetDomainResource(serviceName);
  const [items, setItems] = useState<TDsDataInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const columns = useDomainDsRecordsDatagridColumns();
  const [drawer, setDrawer] = useState<DrawerInformation>({
    isOpen: false,
    action: null,
  });

  useEffect(() => {
    const { dnssecConfiguration } = domainResource.currentState;

    const dsRecords = dnssecConfiguration.dsData ?? [];
    const availableAlgorithms = dnssecConfiguration.supportedAlgorithms ?? [];

    const dsRecordsWithResolvedAlgorithm = dsRecords.map((dsRecord) => {
      if (dsRecord.algorithm === 3) {
        return {
          ...dsRecord,
          supportedAlgorithm: { name: 'RSASHZA3457', number: 3 },
        };
      }

      const matchingSupportedAlgorithm = availableAlgorithms.find(
        (supportedAlgorithm) =>
          supportedAlgorithm.number === dsRecord.algorithm,
      );

      return {
        ...dsRecord,
        supportedAlgorithm: matchingSupportedAlgorithm ?? {
          name: '',
          number: dsRecord.algorithm,
        },
      };
    });

    setIsLoading(false);
    setItems(dsRecordsWithResolvedAlgorithm);
  }, [domainResource]);

  return (
    <div data-testid="datagrid">
      <Datagrid
        columns={columns}
        items={items}
        totalItems={items.length}
        isLoading={isLoading}
        topbar={
          <Button
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
      <DsRecordsDrawer
        drawer={drawer}
        serviceName={serviceName}
        targetSpec={domainResource.targetSpec}
        checksum={domainResource.checksum}
        setDrawer={setDrawer}
      />
    </div>
  );
}
