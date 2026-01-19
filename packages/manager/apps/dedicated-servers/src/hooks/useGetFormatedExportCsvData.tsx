import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDataApi } from '@ovh-ux/muk';
import { getDSVrack } from '@/data/api/vrack';
import { getBillingInfo } from '@/data/api/billingInfo';
import { BillingInfo } from '@/data/types/billing.type';
import { DedicatedServer } from '@/data/types/server.type';
import useDateFormat from '@/hooks/useDateFormat';
import { ExportCsvDataType } from '@/components/exportCsv/types';
import {
  getVrackWording,
  textByProductStatus,
  monitoringStatusWording,
  getTagsWording,
  getRenewWording,
  getEngagementWording,
} from '@/components/commonCellsWording';

type FullDedicatedServerType = DedicatedServer & {
  vrack: string;
  billing: BillingInfo & { endDate?: string };
};

const getAsyncData = {
  vrack: (name: string) =>
    getDSVrack(name)
      .then((data) => data[0])
      .catch(() => {}),
  billing: (name: string) =>
    getBillingInfo(name)
      .then(({ data = {} }) => data)
      .catch(() => {}),
};

const csvRowsMapper: {
  [key: string]: (param: FullDedicatedServerType) => string;
} = {
  serverId: ({ serverId }) => `${serverId}`,
  'iam.displayName': ({ iam: { displayName } = {} }) => displayName,
  ip: ({ ip }) => ip,
  reverse: ({ reverse }) => reverse,
  commercialRange: ({ commercialRange }) => commercialRange,
  os: ({ os }) => os,
  region: ({ region }) => region,
  rack: ({ rack }) => rack,
  datacenter: ({ datacenter }) => datacenter,
  state: ({ state }) => textByProductStatus[state],
  monitoring: ({ monitoring, noIntervention }) =>
    monitoringStatusWording(monitoring, noIntervention),
  vrack: ({ vrack }) => getVrackWording(vrack),
  renew: ({ billing }) => getRenewWording(billing),
  expiration: ({ billing }) => billing?.endDate || '-',
  engagement: ({ billing }) => getEngagementWording(billing),
  price: ({ billing }) => billing?.billing?.pricing?.price?.text || '-',
  tags: ({ iam }) => getTagsWording(iam),
};

const USELESS_COLUMNS = ['actions'];

export default ({ totalCount, columns }: ExportCsvDataType) => {
  const { t } = useTranslation('dedicated-servers');

  const { format } = useDateFormat({
    options: {
      hourCycle: 'h23',
      dateStyle: 'short',
    },
  });

  const { flattenData, totalCount: newTotalCount } = useDataApi({
    version: 'v6',
    iceberg: true,
    enabled: true,
    pageSize: totalCount,
    route: '/dedicated/server',
    cacheKey: ['dedicated-servers', '/dedicated/server'],
  });

  const [csvColumns, setCsvColumns] = useState<string[][]>();
  const [columnsHeadings, columnsIds] = useMemo(
    () =>
      columns
        .filter(({ id }) => !USELESS_COLUMNS.includes(id))
        .reduce(
          ([prevHeadings, prevIds], { label, id }) => [
            [...prevHeadings, label],
            [...prevIds, id],
          ],
          [[], []],
        ),
    [],
  );

  useEffect(() => {
    if (flattenData) {
      (async () => {
        const [vrackPromises, billingInfoPromises] = flattenData.reduce(
          ([prevVrack, prevBillingInfo], { name }: { name: string }) => [
            [...prevVrack, () => getAsyncData.vrack(name)],
            [...prevBillingInfo, () => getAsyncData.billing(name)],
          ],
          [[], []],
        );
        const promisesResults = await Promise.all([
          ...vrackPromises.map((promise) => promise()),
          ...billingInfoPromises.map((promise) => promise()),
        ]);
        const billingInfoValues = [...promisesResults];
        const vrackValues = billingInfoValues.splice(0, newTotalCount);

        const columnsBody = flattenData
          .map((data, i) => ({
            ...data,
            vrack: vrackValues[i],
            billing: {
              ...billingInfoValues[i],
              ...(billingInfoValues[i]?.billing?.expirationDate && {
                endDate: format(
                  new Date(billingInfoValues[i].billing.expirationDate),
                ),
              }),
            },
          }))
          .map((row: FullDedicatedServerType) =>
            columnsIds.map(
              (key) => csvRowsMapper[key] && t(csvRowsMapper[key](row)),
            ),
          );

        setCsvColumns([columnsHeadings, ...columnsBody]);
      })();
    }
  }, [flattenData]);

  return csvColumns;
};
