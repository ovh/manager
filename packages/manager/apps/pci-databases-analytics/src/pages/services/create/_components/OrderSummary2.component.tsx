import { useTranslation } from 'react-i18next';
import {
  Box,
  Boxes,
  Cloud,
  Cloudy,
  Cpu,
  HardDrive,
  HardDriveDownload,
  HardDriveUpload,
  Hash,
  HelpCircle,
  MemoryStick,
} from 'lucide-react';
import {
  Skeleton,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@datatr-ux/uxlib';
import { humanizeEngine } from '@/lib/engineNameHelper';
import * as database from '@/types/cloud/project/database';
import { addStorage, formatStorage } from '@/lib/bytesHelper';
import { Engine, Flavor, Plan, Region, Version } from '@/types/orderFunnel';
import { Network, Subnet } from '@/types/cloud/network';
import { EngineIcon } from '@/components/engine-icon/EngineIcon.component';

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
      <span>{order.name}</span>
      <Popover>
        <PopoverTrigger>
          <HelpCircle className="size-4" />
        </PopoverTrigger>
        <PopoverContent>
          <p>{t('summaryFieldNameInfo')}</p>
        </PopoverContent>
      </Popover>
    </div>
  );
};
const EngineDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Button
          data-testid="engine-section-button"
          className="h-auto p-0 bg-transparent hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline"
          type="button"
          onClick={() => onSectionClicked('engine')}
        >
          {t('summaryFieldEngineLabel')}
        </Button>
        {order.engine && (
          <>
            <span>
              {humanizeEngine(order.engine.name as database.EngineEnum)}
            </span>
            <EngineIcon
              engine={order.engine.name as database.EngineEnum}
              category={order.engine.category}
              iconSize={10}
            />
          </>
        )}
      </div>
      <div className="flex items-center pl-4 gap-2">
        <Hash className="size-4" />
        {order.version?.name ? (
          <span>
            {t('summaryFieldEngineVersion', { version: order.version?.name })}
          </span>
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
        data-testid="plan-section-button"
        className="h-auto p-0 bg-transparent hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline"
        type="button"
        onClick={() => onSectionClicked('plan')}
      >
        {t('summaryFieldPlanLabel')}
      </Button>
      {order.plan ? (
        <span className="capitalize">{order.plan.name}</span>
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
        data-testid="region-section-button"
        className="h-auto p-0 bg-transparent hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline"
        type="button"
        onClick={() => onSectionClicked('region')}
      >
        {t('summaryFieldRegionLabel')}
      </Button>
      {order.region ? (
        <span>
          {tRegions(`region_${order.region.name}_micro`, {
            micro: order.region.name,
          })}
        </span>
      ) : (
        <Skeleton className="h-4 w-20" />
      )}
    </div>
  );
};
const FlavorDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Button
          data-testid="flavor-section-button"
          className="h-auto p-0 bg-transparent hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline"
          type="button"
          onClick={() => onSectionClicked('flavor')}
        >
          Instance
        </Button>
        {order.flavor ? (
          <span className="capitalize">{order.flavor.name}</span>
        ) : (
          <Skeleton className="h-4 w-20" />
        )}
      </div>
      {(order.flavor?.vcores > 0 || order.flavor?.ram.value > 0) && (
        <div>
          <div className="flex items-center pl-4 gap-2">
          <Boxes className="size-4" />
          <span>{t('summaryFieldClusterNodes', { count: order.nodes })}</span>
        </div>
          {order.flavor.vcores > 0 && (
            <div className="flex items-center pl-4 gap-2">
              <Cpu className="size-4" />
              <span>
                {t('summaryFieldFlavorCores', { count: order.flavor.vcores })}
              </span>
            </div>
          )}
          {order.flavor.ram.value > 0 && (
            <div className="flex items-center pl-4 gap-2">
              <MemoryStick className="size-4" />
              <span>
                {t('summaryFieldFlavorMemory', {
                  memory: formatStorage(order.flavor.ram),
                })}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
const StorageDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  const totalStorage = order.flavor?.storage
    ? addStorage(order.flavor.storage.minimum, {
        value: order.additionalStorage,
        unit: 'GB',
      })
    : { unit: 'GB', value: 0 };
  return (
    <div className="flex items-start flex-col">
      <Button
        data-testid="cluster-section-button"
        className="h-auto p-0 bg-transparent hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline"
        type="button"
        onClick={() => onSectionClicked('storage')}
      >
        Stockage
      </Button>
      <div>
        <div className="flex items-center pl-4 gap-2">
          <Box className="size-4" />
          <span>Type: High speed gen2</span>
        </div>
        <div className="flex items-center pl-4 gap-2">
          <HardDriveDownload className="size-4" />
          <span>{Math.min(20000, 30 * totalStorage.value)} IOPS</span>
        </div>
        <div className="flex items-center pl-4 gap-2">
          <HardDriveUpload className="size-4" />
          <span>{totalStorage.value} GB/s</span>
        </div>
        <div className="flex items-center pl-4 gap-2">
          <HardDrive className="size-4" />
          {order.additionalStorage > 0 ? (
            <span>
              {t('summaryFieldClusterStorageExtra', {
                storage: formatStorage(totalStorage),
                includedStorage: formatStorage(order.flavor.storage.minimum),
              })}
            </span>
          ) : (
            <span>
              {t('summaryFieldClusterStorage', {
                storage: formatStorage(order.flavor.storage.minimum),
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
const NetworkDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  return (
    <div className="flex items-start flex-col">
      <div className="divide-x-[0.5rem] divide-transparent">
        <Button
          data-testid="network-section-button"
          className="h-auto p-0 bg-transparent hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline"
          type="button"
          onClick={() => onSectionClicked('options')}
        >
          {t('summaryFieldNetworkLabel')}
        </Button>
        <span>{t(`summaryFieldNetwork-${order.network.type}`)}</span>
      </div>
      {order.network.type === database.NetworkTypeEnum.private && (
        <div>
          <div className="flex items-center pl-4 gap-2 flex-wrap">
            <Cloud className="size-4" />
            <span>{t('summaryFieldNetworkNetwork')}</span>
            {order.network.network ? (
              <span>{order.network.network.name}</span>
            ) : (
              <span className="text-red-500">
                {t('summaryFieldNetworNone')}
              </span>
            )}
          </div>
          <div className="flex items-center pl-4 gap-2">
            <Cloudy className="size-4" />
            <span>{t('summaryFieldNetworSubnet')}</span>
            {order.network.subnet ? (
              <span>{order.network.subnet.cidr}</span>
            ) : (
              <span className="text-red-500">
                {t('summaryFieldNetworNone')}
              </span>
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
        data-testid="ips-section-button"
        className="h-auto p-0 bg-transparent hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline"
        type="button"
        onClick={() => onSectionClicked('options')}
      >
        {t('summaryFieldIpsLabel')}
      </Button>
      <span>
        {t(`summaryFieldIps`, {
          count: order.ipRestrictions.length,
          context: `${order.ipRestrictions.length}`,
        })}
      </span>
    </div>
  );
};

const OrderSummary2 = ({ order, onSectionClicked }: OrderSummaryProps) => {
  return (
    <div className="grid grid-cols-1 gap-1">
      <NameDetails order={order} />
      <EngineDetails order={order} onSectionClicked={onSectionClicked} />
      <PlanDetails order={order} onSectionClicked={onSectionClicked} />
      <RegionDetails order={order} onSectionClicked={onSectionClicked} />
      <FlavorDetails order={order} onSectionClicked={onSectionClicked} />
      {order.flavor?.storage && (
        <StorageDetails order={order} onSectionClicked={onSectionClicked} />
      )}
      <NetworkDetails order={order} onSectionClicked={onSectionClicked} />
      <IpsDetails order={order} onSectionClicked={onSectionClicked} />
    </div>
  );
};

export default OrderSummary2;
