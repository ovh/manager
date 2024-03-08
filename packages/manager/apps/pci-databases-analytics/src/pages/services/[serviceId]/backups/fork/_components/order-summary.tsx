import { useTranslation } from 'react-i18next';
import {
  Boxes,
  Clock,
  Cloud,
  Cloudy,
  Cpu,
  HardDrive,
  Hash,
  HelpCircle,
  MemoryStick,
} from 'lucide-react';
import { humanizeEngine } from '@/lib/engineNameHelper';
import { database } from '@/models/database';
import { addStorage, formatStorage } from '@/lib/bytesHelper';
import {
  Engine,
  Flavor,
  ForkSource,
  Plan,
  Region,
  Version,
} from '@/models/order-funnel';
import { Skeleton } from '@/components/ui/skeleton';
import { P, Span } from '@/components/typography';
import { Network, Subnet } from '@/models/network';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import FormattedDate from '@/components/table-date';

interface OrderSummaryProps {
  order: {
    source: ForkSource;
    engine: Engine;
    version: Version;
    plan: Plan;
    region: Region;
    flavor: Flavor;
    nodes: number;
    additionalStorage: number;
    name: string;
    ipRestrictions: {
      ip: string;
      description: string;
    }[];
    network: {
      type: database.NetworkTypeEnum;
      network?: Network;
      subnet?: Subnet;
    };
  };
  onSectionClicked?: (target: string) => void;
}

const NameDetails = ({ order }: OrderSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  return (
    <div className="flex items-center gap-2">
      <b>{t('summaryFieldNameLabel')}</b>
      <Span>{order.name}</Span>
      <Popover>
        <PopoverTrigger>
          <HelpCircle className="size-4" />
        </PopoverTrigger>
        <PopoverContent>
          <P>{t('summaryFieldNameInfo')}</P>
        </PopoverContent>
      </Popover>
    </div>
  );
};
const SourceDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  // const { t } = useTranslation('pci-databases-analytics/services/new');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant={'link'}
          size={'link'}
          type="button"
          onClick={() => onSectionClicked('source')}
          className="font-bold"
        >
          Point de restauration
        </Button>
        {order.source && <Span>{order.source.type}</Span>}
      </div>
      {order.source.type !== 'now' && (
        <div className="flex items-start pl-4 gap-2">
          <Clock className="size-4" />
          {order.source.type === 'pit' && (
            <Span>
              <FormattedDate
                date={order.source.pointInTime}
                options={{ dateStyle: 'medium', timeStyle: 'medium' }}
              />
            </Span>
          )}
          {order.source.type === 'backup' && (
            <Span>
              {/* <FormattedDate date={order.ba} /> */}
              {order.source.backupId ? (
                <Span>{order.source.backupId}</Span>
              ) : (
                <Span className="text-red-500">Aucun</Span>
              )}
            </Span>
          )}
        </div>
      )}
    </div>
  );
};
const EngineDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant={'link'}
          size={'link'}
          type="button"
          onClick={() => onSectionClicked('engine')}
          className="font-bold"
        >
          {t('summaryFieldEngineLabel')}
        </Button>
        {order.engine && (
          <>
            <Span>
              {humanizeEngine(order.engine.name as database.EngineEnum)}
            </Span>
            <img
              className="block w-9 h-6"
              src={`./assets/engines/${order.engine.name}.png`}
              alt={order.engine.name}
            />
          </>
        )}
      </div>
      <div className="flex items-start pl-4 gap-2">
        <Hash className="size-4" />
        {order.version?.name ? (
          <Span>
            {t('summaryFieldEngineVersion', { version: order.version?.name })}
          </Span>
        ) : (
          <Skeleton className="h-4 w-16" />
        )}
      </div>
    </div>
  );
};
const PlanDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  return (
    <div className="flex items-center gap-2">
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
        <Span className="capitalize">{order.plan.name}</Span>
      ) : (
        <Skeleton className="h-4 w-20" />
      )}
    </div>
  );
};
const RegionDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  const { t: tRegions } = useTranslation('regions');
  return (
    <div className="flex items-center gap-2">
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
  );
};
const FlavorDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
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
          <Span className="capitalize">{order.flavor.name}</Span>
        ) : (
          <Skeleton className="h-4 w-20" />
        )}
      </div>
      {(order.flavor?.vcores > 0 || order.flavor?.ram.value > 0) && (
        <div>
          {order.flavor.vcores > 0 && (
            <div className="flex items-start pl-4 gap-2">
              <Cpu className="size-4" />
              <Span>
                {t('summaryFieldFlavorCores', { count: order.flavor.vcores })}
              </Span>
            </div>
          )}
          {order.flavor.ram.value > 0 && (
            <div className="flex items-start pl-4 gap-2">
              <MemoryStick className="size-4" />
              <Span>
                {t('summaryFieldFlavorMemory', {
                  memory: formatStorage(order.flavor.ram),
                })}
              </Span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
const ClusterDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  const totalStorage = order.flavor?.storage
    ? addStorage(order.flavor.storage.minimum, {
        value: order.additionalStorage,
        unit: 'GB',
      })
    : { unit: 'GB', value: 0 };
  return (
    <div className="flex items-start flex-col gap-2">
      <Button
        variant={'link'}
        size={'link'}
        type="button"
        onClick={() => onSectionClicked('cluster')}
        className="font-bold"
      >
        {t('summaryFieldClusterLabel')}
      </Button>
      <div>
        <div className="flex items-start pl-4 gap-2">
          <Boxes className="size-4" />
          <Span>{t('summaryFieldClusterNodes', { count: order.nodes })}</Span>
        </div>
        {order.flavor?.storage && (
          <div className="flex items-start pl-4 gap-2">
            <HardDrive className="size-4" />
            {order.additionalStorage > 0 ? (
              <Span>
                {t('summaryFieldClusterStorageExtra', {
                  storage: formatStorage(totalStorage),
                  includedStorage: formatStorage(order.flavor.storage.minimum),
                })}
              </Span>
            ) : (
              <Span>
                {t('summaryFieldClusterStorage', {
                  storage: formatStorage(order.flavor.storage.minimum),
                })}
              </Span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
const NetworkrDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  return (
    <div className="flex items-start flex-col gap-2">
      <div className="divide-x-[0.5rem] divide-transparent">
        <Button
          variant={'link'}
          size={'link'}
          type="button"
          onClick={() => onSectionClicked('options')}
          className="font-bold"
        >
          {t('summaryFieldNetworkLabel')}
        </Button>
        <Span>{t(`summaryFieldNetwork-${order.network.type}`)}</Span>
      </div>
      {order.network.type === database.NetworkTypeEnum.private && (
        <div>
          <div className="flex items-start pl-4 gap-2 flex-wrap">
            <Cloud className="size-4" />
            <Span>{t('summaryFieldNetworkNetwork')}</Span>
            {order.network.network ? (
              <Span>{order.network.network.name}</Span>
            ) : (
              <Span className="text-red-500">
                {t('summaryFieldNetworNone')}
              </Span>
            )}
          </div>
          <div className="flex items-start pl-4 gap-2">
            <Cloudy className="size-4" />
            <Span>{t('summaryFieldNetworSubnet')}</Span>
            {order.network.subnet ? (
              <Span>{order.network.subnet.cidr}</Span>
            ) : (
              <Span className="text-red-500">
                {t('summaryFieldNetworNone')}
              </Span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
const IpsDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={'link'}
        size={'link'}
        type="button"
        onClick={() => onSectionClicked('options')}
        className="font-bold"
      >
        {t('summaryFieldIpsLabel')}
      </Button>
      <Span>
        {t(`summaryFieldIps`, {
          count: order.ipRestrictions.length,
          context: `${order.ipRestrictions.length}`,
        })}
      </Span>
    </div>
  );
};

const OrderSummary = ({ order, onSectionClicked }: OrderSummaryProps) => {
  return (
    <div className="grid grid-cols-1 gap-2">
      <NameDetails order={order} />
      <SourceDetails order={order} onSectionClicked={onSectionClicked} />
      <EngineDetails order={order} onSectionClicked={onSectionClicked} />
      <PlanDetails order={order} onSectionClicked={onSectionClicked} />
      <RegionDetails order={order} onSectionClicked={onSectionClicked} />
      <FlavorDetails order={order} onSectionClicked={onSectionClicked} />
      <ClusterDetails order={order} onSectionClicked={onSectionClicked} />
      <NetworkrDetails order={order} onSectionClicked={onSectionClicked} />
      <IpsDetails order={order} onSectionClicked={onSectionClicked} />
    </div>
  );
};

export default OrderSummary;
