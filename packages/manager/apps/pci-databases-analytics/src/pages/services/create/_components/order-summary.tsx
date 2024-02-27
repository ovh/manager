import { Trans, useTranslation } from 'react-i18next';
import { humanizeEngine } from '@/lib/engineNameHelper';
import { database } from '@/models/database';
import { formatStorage } from '@/lib/bytesHelper';
import { Engine, Flavor, Plan, Region, Version } from '@/models/order-funnel';
import { Skeleton } from '@/components/ui/skeleton';
import { P, Span } from '@/components/typography';
import { Network, Subnet } from '@/models/network';
import { Button } from '@/components/ui/button';

interface OrderSummaryProps {
  order: {
    engine: Engine;
    version: Version;
    plan: Plan;
    region: Region;
    flavor: Flavor;
    nodes: number;
    additionalStorage: number;
    name: string;
    network: {
      type: database.NetworkTypeEnum;
      network?: Network;
      subnet?: Subnet;
    };
  };
  onSectionClicked: (target: string) => void;
}
const OrderSummary = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t: tRegions } = useTranslation('regions');
  const { t } = useTranslation('pci-databases-analytics/services/new');
  return (
    <div className="grid grid-cols-1 gap-2">
      <div>
        <b>{t('summaryFieldNameLabel')}</b>
        <Span>{order.name}</Span>
        <Span>i</Span>
      </div>
      <div>
        <div className="flex">
          <Button
            variant={'link'}
            size={'link'}
            type="button"
            onClick={() => onSectionClicked('engine')}
            className="font-bold"
          >
            {t('summaryFieldEngineLabel')}
          </Button>
          {order.engine ? (
            <div className="flex items-center">
              <Span>{`${humanizeEngine(
                order.engine.name as database.EngineEnum,
              )} ${order.version.name}`}</Span>
              <img
                className="block w-[30px] h-[20px]"
                src={`./assets/engines/${order.engine.name}.png`}
              />
            </div>
          ) : (
            <Skeleton className="h-4 w-40" />
          )}
        </div>
      </div>
      <div>
        <Button
          variant={'link'}
          size={'link'}
          type="button"
          onClick={() => onSectionClicked('plan')}
          className="font-bold"
        >
          {t('summaryFieldPlanLabel')}
        </Button>
        {order.plan ? (
          <Span>{order.plan.name}</Span>
        ) : (
          <Skeleton className="h-4 w-20" />
        )}
      </div>
      <div>
        <Button
          variant={'link'}
          size={'link'}
          type="button"
          onClick={() => onSectionClicked('region')}
          className="font-bold"
        >
          {t('summaryFieldRegionLabel')}
        </Button>
        {order.region ? (
          <Span>
            {tRegions(`region_${order.region.name}_micro`, {
              micro: order.region.name,
            })}
          </Span>
        ) : (
          <Skeleton className="h-4 w-20" />
        )}
      </div>
      <div>
        <Button
          variant={'link'}
          size={'link'}
          type="button"
          onClick={() => onSectionClicked('flavor')}
          className="font-bold"
        >
          {t('summaryFieldFlavorLabel')}
        </Button>
        {order.flavor ? (
          <>
            <Span>{order.flavor.name}</Span>
            <P>
              {t('summaryFieldFlavorCores', { count: order.flavor.vcores })}
            </P>
            <P>
              {t('summaryFieldFlavorMemory', {
                memory: formatStorage(order.flavor.ram),
              })}
            </P>
          </>
        ) : (
          <>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </>
        )}
      </div>
      <div>
        <Button
          variant={'link'}
          size={'link'}
          type="button"
          onClick={() => onSectionClicked('cluster')}
          className="font-bold"
        >
          {t('summaryFieldClusterLabel')}
        </Button>
        <P>{t('summaryFieldFlavorCores', { count: order.nodes })}</P>
        {order.flavor?.storage && (
          <P>
            {formatStorage({
              value:
                order.additionalStorage + order.flavor.storage.minimum.value,
              unit: order.flavor.storage.minimum.unit,
            })}{' '}
            (dont {formatStorage(order.flavor.storage.minimum)} inclus)
          </P>
        )}
      </div>
      <div>
        <Button
          variant={'link'}
          size={'link'}
          type="button"
          onClick={() => onSectionClicked('options')}
          className="font-bold"
        >
          {t('summaryFieldNetworkLabel')}
        </Button>
        <Span>{order.network.type}</Span>
        {order.network.type === database.NetworkTypeEnum.private && (
          <div className="ml-4">
            <P>
              {t('summaryFieldNetworNetwork')}:{' '}
              {order.network.network?.name || (
                <Span className="text-red-500">-</Span>
              )}
            </P>
            <P>
              {t('summaryFieldNetworSubnet')}{' '}
              {order.network.subnet?.cidr || (
                <Span className="text-red-500">-</Span>
              )}
            </P>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
