import { useTranslation } from 'react-i18next';
import {
  Boxes,
  Cloud,
  Cloudy,
  Cpu,
  Database,
  HardDrive,
  Hash,
  MemoryStick,
  Save,
  Link,
  Tag,
  Globe,
  NetworkIcon,
  Clock,
  LucideArrowDownCircle,
} from 'lucide-react';
import { Skeleton, Button, Separator } from '@datatr-ux/uxlib';
import { ReactNode } from 'react';
import { humanizeEngine } from '@/lib/engineNameHelper';
import * as database from '@/types/cloud/project/database';
import { addStorage, formatStorage } from '@/lib/bytesHelper';
import { ForkSourceType } from '@/types/orderFunnel';
import { EngineIcon } from '@/components/engine-icon/EngineIcon.component';
import { useOrderFunnel } from './useOrderFunnel.hook';
import { getRegionFlag } from '@/lib/flagHelper';
import Flag from '@/components/flag/Flag.component';
import { useFork } from '../../[serviceId]/backups/fork/_components/useFork.hook';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';

interface OrderSummaryProps {
  order:
    | ReturnType<typeof useOrderFunnel>['result']
    | ReturnType<typeof useFork>['result'];
  onSectionClicked?: (target: string) => void;
}

const AnchorLabel = ({
  label,
  onClick,
}: {
  label: string;
  onClick: (id: string) => void;
}) => (
  <Button
    className="h-auto p-0 bg-transparent hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline text-sm"
    type="button"
    onClick={() => onClick('options')}
  >
    {label}
    <Link className="ml-1 size-3" />
  </Button>
);

const SummarySection = ({
  label,
  onAnchorClicked,
  children,
  hideSeparator = false,
}: {
  label: string;
  onAnchorClicked: (id: string) => void;
  children: ReactNode;
  hideSeparator?: boolean;
}) => (
  <div>
    <AnchorLabel label={label} onClick={onAnchorClicked} />
    {children}

    {!hideSeparator && <Separator className="bg-[#ebebeb] h-[2px] mt-2" />}
  </div>
);

const SummaryItem = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center gap-2">{children}</div>
);

const SummarySkeleton = () => <Skeleton className="h-4 w-16" />;

const OrderSummary = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  const { t: tRegions } = useTranslation('regions');
  const totalStorage = order.flavor?.storage
    ? addStorage(order.flavor.storage.minimum, {
        value: order.additionalStorage,
        unit: 'GB',
      })
    : { unit: 'GB', value: 0 };
  return (
    <div className="grid grid-cols-1 gap-2 bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-sm text-heading font-semibold text-sm max-h-[40vh] overflow-auto">
      {/* Service section */}
      <SummarySection
        label={t('orderSectionTitleService')}
        onAnchorClicked={() => onSectionClicked('engine')}
      >
        {order.name ? (
          <SummaryItem>
            <Tag className="size-4" />
            <span>{order.name}</span>
          </SummaryItem>
        ) : (
          <SummarySkeleton />
        )}
        {order.engine?.name ? (
          <SummaryItem>
            <Database className="size-4" />
            <span>
              {humanizeEngine(order.engine.name as database.EngineEnum)}
            </span>
            <EngineIcon
              engine={order.engine.name as database.EngineEnum}
              category={order.engine.category}
              iconSize={10}
            />
          </SummaryItem>
        ) : (
          <SummarySkeleton />
        )}
        <SummaryItem>
          <Hash className="size-4" />
          {order.version?.name ? (
            <span>
              {t('summaryFieldEngineVersion', { version: order.version?.name })}
            </span>
          ) : (
            <SummarySkeleton />
          )}
        </SummaryItem>
      </SummarySection>

      {/* Source secrion */}
      {'source' in order && (
        <SummarySection
          label={t('orderSectionTitleSource')}
          onAnchorClicked={() => onSectionClicked('source')}
        >
          <SummaryItem>
            <LucideArrowDownCircle className="size-4" />
            <span>{t(`summaryFieldSourceType-${order.source.type}`)}</span>
          </SummaryItem>

          {order.source.type !== ForkSourceType.now && (
            <SummaryItem>
              <Clock className="size-4" />
              {order.source.type === ForkSourceType.pit && (
                <FormattedDate
                  date={order.source.pointInTime}
                  options={{ dateStyle: 'medium', timeStyle: 'medium' }}
                />
              )}
              {order.source.type === 'backup' &&
                (order.backup ? (
                  <>
                    <FormattedDate
                      date={new Date(order.backup.createdAt)}
                      options={{ dateStyle: 'medium', timeStyle: 'medium' }}
                    />
                    &nbsp;({formatStorage(order.backup.size)})
                  </>
                ) : (
                  <span className="text-red-500">
                    {t('summaryFieldSourceBackupNone')}
                  </span>
                ))}
            </SummaryItem>
          )}
        </SummarySection>
      )}

      {/* Region section */}
      <SummarySection
        label={t('orderSectionTitleRegion')}
        onAnchorClicked={() => onSectionClicked('region')}
      >
        <SummaryItem>
          {order.region ? (
            <span className="flex gap-2 items-center">
              <Flag flagName={getRegionFlag(order.region.name)} />
              {tRegions(`region_${order.region.name}_micro`, {
                micro: order.region.name,
              })}
            </span>
          ) : (
            <SummarySkeleton />
          )}
        </SummaryItem>
      </SummarySection>

      {/* plan section */}
      <SummarySection
        label={t('orderSectionTitlePlan')}
        onAnchorClicked={() => onSectionClicked('plan')}
      >
        {order.plan ? (
          <SummaryItem>
            <Tag className="size-4" />
            <span className="capitalize">{order.plan.name}</span>
          </SummaryItem>
        ) : (
          <SummarySkeleton />
        )}
        {!!order.availability?.backups?.retentionDays && (
          <SummaryItem>
            <Save className="size-4" />
            <span>
              {t('summaryFieldBackupRetention', {
                count: order.availability?.backups?.retentionDays,
              })}
            </span>
          </SummaryItem>
        )}
      </SummarySection>

      {/* flavor section */}
      <SummarySection
        label={t('orderSectionTitleFlavor')}
        onAnchorClicked={() => onSectionClicked('flavor')}
      >
        {order.flavor ? (
          <SummaryItem>
            <Tag className="size-4" />
            <span className="capitalize">{order.flavor.name}</span>
          </SummaryItem>
        ) : (
          <SummarySkeleton />
        )}
        {(order.flavor?.vcores > 0 || order.flavor?.ram.value > 0) && (
          <>
            <SummaryItem>
              <Boxes className="size-4" />
              <span>
                {t('summaryFieldClusterNodes', { count: order.nodes })}
              </span>
            </SummaryItem>
            {order.flavor.vcores > 0 && (
              <SummaryItem>
                <Cpu className="size-4" />
                <span>
                  {t('summaryFieldFlavorCores', { count: order.flavor.vcores })}
                </span>
              </SummaryItem>
            )}
            {order.flavor.ram.value > 0 && (
              <SummaryItem>
                <MemoryStick className="size-4" />
                <span>
                  {t('summaryFieldFlavorMemory', {
                    memory: formatStorage(order.flavor.ram),
                  })}
                </span>
              </SummaryItem>
            )}
          </>
        )}
      </SummarySection>

      {/* Storage section */}
      {order.flavor?.storage && (
        <SummarySection
          label={t('orderSectionTitleStorage')}
          onAnchorClicked={() => onSectionClicked('storage')}
        >
          <SummaryItem>
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
          </SummaryItem>
        </SummarySection>
      )}

      {/* Options section */}
      <SummarySection
        label={t('orderSectionTitleOptions')}
        onAnchorClicked={() => onSectionClicked('options')}
        hideSeparator
      >
        <SummaryItem>
          <Globe className="size-4" />
          {t(`summaryFieldNetwork-${order.network.type}`)}
        </SummaryItem>
        {order.network.type === database.NetworkTypeEnum.private && (
          <>
            <SummaryItem>
              <Cloud className="size-4" />
              <span>{t('summaryFieldNetworkNetwork')}</span>
              {order.network.network ? (
                <span>{order.network.network.name}</span>
              ) : (
                <span className="text-red-500">
                  {t('summaryFieldNetworNone')}
                </span>
              )}
            </SummaryItem>
            <SummaryItem>
              <Cloudy className="size-4" />
              <span>{t('summaryFieldNetworSubnet')}</span>
              {order.network.subnet ? (
                <span>{order.network.subnet.cidr}</span>
              ) : (
                <span className="text-red-500">
                  {t('summaryFieldNetworNone')}
                </span>
              )}
            </SummaryItem>
          </>
        )}
        <SummaryItem>
          <NetworkIcon className="size-4" />
          {t(`summaryFieldIps`, {
            count: order.ipRestrictions.length,
            context: `${order.ipRestrictions.length}`,
          })}
        </SummaryItem>
      </SummarySection>
    </div>
  );
};

export default OrderSummary;
