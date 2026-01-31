import { useTranslation } from 'react-i18next';
import { Skeleton } from '@datatr-ux/uxlib';
import { CartItem } from '@/components/cart/cart.types';
import { useOrderFunnel } from './useOrderFunnel.hook';
import { useFork } from '@/pages/services/[serviceId]/backups/fork/_components/useFork.hook';
import { addStorage, formatStorage } from '@/lib/bytesHelper';
import { humanizeEngine } from '@/lib/engineNameHelper';
import * as database from '@/types/cloud/project/database';
import { ForkSourceType } from '@/types/orderFunnel';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { ucentToEur } from '@/lib/pricingHelper';

interface UseCartItemsParams {
  order:
    | ReturnType<typeof useOrderFunnel>['result']
    | ReturnType<typeof useFork>['result'];
}

const DescriptionSkeleton = () => (
  <Skeleton className="h-4 w-32 my-1 bg-neutral-100" />
);

export const useCartItems: (params: UseCartItemsParams) => CartItem[] = ({
  order,
}: UseCartItemsParams) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  const { t: tRegions } = useTranslation('regions');

  const source =
    'source' in order
      ? {
          name: t('orderSectionTitleSource'),
          description: (
            <div className="flex flex-col">
              <span>{t(`summaryFieldSourceType-${order.source.type}`)}</span>
              {order.source.type !== ForkSourceType.now && (
                <span>
                  {order.source.type === ForkSourceType.pit && (
                    <FormattedDate
                      date={order.source.pointInTime}
                      options={{ dateStyle: 'medium', timeStyle: 'medium' }}
                    />
                  )}
                </span>
              )}
              {order.source.type === 'backup' &&
                (order.backup ? (
                  <>
                    <FormattedDate
                      date={new Date(order.backup.createdAt)}
                      options={{ dateStyle: 'medium', timeStyle: 'medium' }}
                    />{' '}
                    ({formatStorage(order.backup.size)})
                  </>
                ) : (
                  <span className="text-red-500">
                    {t('summaryFieldSourceBackupNone')}
                  </span>
                ))}
            </div>
          ),
        }
      : null;

  const region = {
    name: t('orderSectionTitleRegion'),
    description: order.region ? (
      tRegions(`region_${order.region.name}_micro`, {
        micro: order.region.name,
      })
    ) : (
      <DescriptionSkeleton />
    ),
  };

  const engine = {
    name: t('orderSectionTitleService'),
    description: order.engine ? (
      <>
        {humanizeEngine(order.engine.name as database.EngineEnum)} -{' '}
        {t('summaryFieldEngineVersion', {
          version: order.version?.name,
        })}
      </>
    ) : (
      <DescriptionSkeleton />
    ),
  };

  const plan = {
    name: t('orderSectionTitlePlan'),
    description: (
      <div className="flex flex-col">
        {order.plan ? (
          <>
            <span className="capitalize">{order.plan.name}</span>
            <span>
              {t('summaryFieldBackupRetention', {
                count: order.availability?.backups?.retentionDays,
              })}
            </span>
          </>
        ) : (
          <>
            <DescriptionSkeleton />
            <DescriptionSkeleton />
          </>
        )}
      </div>
    ),
  };

  const flavor = {
    name: t('orderSectionTitleFlavor'),
    description: (
      <div className="flex flex-col">
        {order.flavor ? (
          <>
            <span className="capitalize">{order.flavor.name}</span>
            <span>
              {t('summaryFieldClusterNodes', {
                count: order.nodes,
              })}
            </span>
            <span>
              {t('summaryFieldFlavorCores', {
                count: order.flavor.vcores,
              })}
            </span>
            <span>
              {t('summaryFieldFlavorMemory', {
                memory: formatStorage(order.flavor.ram),
              })}
            </span>
          </>
        ) : (
          <>
            <DescriptionSkeleton />
            <DescriptionSkeleton />
            <DescriptionSkeleton />
            <DescriptionSkeleton />
          </>
        )}
      </div>
    ),
    price: order.price.flavorPrice.price / ucentToEur,
    priceWithTax:
      (order.price.flavorPrice.price + order.price.flavorPrice.tax) /
      ucentToEur,
  };

  const storage = {
    name: t('orderSectionTitleStorage'),
    description: order.flavor?.storage ? (
      t(
        order.additionalStorage > 0
          ? 'summaryFieldClusterStorageExtra'
          : 'summaryFieldClusterStorage',
        {
          storage: formatStorage(
            addStorage(order.flavor.storage.minimum, {
              value: order.additionalStorage,
              unit: 'GB',
            }),
          ),
          includedStorage: formatStorage(order.flavor.storage.minimum),
        },
      )
    ) : (
      <DescriptionSkeleton />
    ),
    price: order.price.storagePrice.price / ucentToEur,
    priceWithTax:
      (order.price.storagePrice.price + order.price.storagePrice.tax) /
      ucentToEur,
  };

  const network = {
    name: t('orderSectionTitleNetwork'),
    description: (
      <div className="flex flex-col">
        {t(`summaryFieldNetwork-${order.network.type}`)}
        {order.network.type === database.NetworkTypeEnum.private && (
          <>
            <div className="flex gap-1">
              <span>{t('summaryFieldNetworkNetwork')}</span>
              {order.network.network ? (
                <span>{order.network.network.name}</span>
              ) : (
                <span className="text-red-500">
                  {t('summaryFieldNetworkNone')}
                </span>
              )}
            </div>
            <div className="flex gap-1">
              <span>{t('summaryFieldNetworkSubnet')}</span>
              {order.network.subnet ? (
                <span>{order.network.subnet.cidr}</span>
              ) : (
                <span className="text-red-500">
                  {t('summaryFieldNetworkNone')}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    ),
  };

  const ips = {
    name: t('orderSectionTitleIps'),
    description: t(`summaryFieldIps`, {
      count: order.ipRestrictions.length,
      context: `${order.ipRestrictions.length}`,
    }),
  };

  return [
    {
      id: 'databaseToCreate',
      title: t('summaryTitle'),
      name: order.name,
      expanded: true,
      details: [
        source,
        region,
        engine,
        plan,
        flavor,
        storage,
        network,
        ips,
      ].filter(Boolean),
    },
  ];
};
