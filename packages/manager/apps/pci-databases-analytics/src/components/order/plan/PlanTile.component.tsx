import { useTranslation } from 'react-i18next';
import { Badge } from '@datatr-ux/uxlib';
import RadioTile from '@/components/radio-tile/RadioTile.component';
import { compareStorage, formatStorage } from '@/lib/bytesHelper';
import * as database from '@/types/cloud/project/database';
import { Plan } from '@/types/orderFunnel';
import { getTagVariant } from '@/lib/tagsHelper';

export const PlanTile = ({
  plan,
  selected,
  onChange,
}: {
  plan: Plan;
  selected: boolean;
  onChange: (newPlan: string) => void;
}) => {
  const { t } = useTranslation('pci-databases-analytics/components/plan');
  const hasPrivateNetwork = plan.networks.includes(
    database.NetworkTypeEnum.private,
  );
  return (
    <RadioTile
      data-testid={`plan-tile-radio-tile-${plan.name}`}
      name="plan-select"
      onChange={() => onChange(plan.name)}
      value={plan.name}
      checked={selected}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between w-full">
            <h5
              className={`capitalize ${selected ? 'font-bold' : 'font-normal'}`}
            >
              {plan.name}
            </h5>
            <div>
              {plan.tags.map((tag) => (
                <Badge
                  data-testid={`plan-tile-badge-${tag}`}
                  key={tag}
                  variant={getTagVariant(tag)}
                  className="text-xs h-4"
                >
                  {t(`planTag-${tag}`, tag)}
                </Badge>
              ))}
            </div>
          </div>
          <RadioTile.Separator />
        </div>
        <div className="text-xs flex flex-col">
          <PlanTile.Ram ram={plan.ram} />
          <PlanTile.Cpu cpu={plan.cpu} />
          <PlanTile.Storage storage={plan.storage} />
          <PlanTile.Nodes nodes={plan.nodes} />
          {plan.backups && <span>{t('backupsSpec')}</span>}
          {hasPrivateNetwork && <span>{t('privateNetworkSpec')}</span>}
        </div>
      </div>
    </RadioTile>
  );
};

PlanTile.Ram = function PlanTilesRam({ ram }: Partial<Plan>) {
  const { t } = useTranslation('pci-databases-analytics/components/plan');
  if (!ram || ram.maximum.value === 0) return <></>;
  if (compareStorage(ram.minimum, ram.maximum) === 0) {
    return (
      <span data-testid="plan-tile-ram-spec">
        {t('memorySpec', { memory: formatStorage(ram.minimum) })}
      </span>
    );
  }
  return (
    <span data-testid="plan-tile-ram-range">
      {t('memorySpecRange', {
        min: formatStorage(ram.minimum),
        max: formatStorage(ram.maximum),
      })}
    </span>
  );
};
PlanTile.Cpu = function PlanTilesCpu({ cpu }: Partial<Plan>) {
  const { t } = useTranslation('pci-databases-analytics/components/plan');
  if (!cpu || cpu.maximum === 0) return <></>;
  if (cpu.minimum === cpu.maximum) {
    return (
      <span data-testid="plan-tile-cpu-spec">
        {t('cpuSpec', { count: cpu.minimum })}
      </span>
    );
  }
  return (
    <span data-testid="plan-tile-cpu-range">
      {t('cpuSpecRange', {
        min: cpu.minimum,
        max: cpu.maximum,
      })}
    </span>
  );
};
PlanTile.Nodes = function PlanTilesNodes({ nodes }: Partial<Plan>) {
  const { t } = useTranslation('pci-databases-analytics/components/plan');
  if (!nodes || nodes.maximum === 0) return <></>;
  if (nodes.minimum === nodes.maximum) {
    return (
      <span data-testid="plan-tile-nodes-spec">
        {t('nodeSpec', { count: nodes.minimum })}
      </span>
    );
  }
  return (
    <span data-testid="plan-tile-nodes-range">
      {t('nodeSpecRange', {
        min: nodes.minimum,
        max: nodes.maximum,
      })}
    </span>
  );
};

PlanTile.Storage = function PlanTileStorage({ storage }: Partial<Plan>) {
  const { t } = useTranslation('pci-databases-analytics/components/plan');
  if (!storage || storage.maximum.value === 0) return <></>;
  if (
    storage.minimum.value === storage.maximum.value &&
    storage.minimum.unit === storage.maximum.unit
  ) {
    return (
      <span data-testid="plan-tile-storage-spec">
        {t('storageSpec', { storage: formatStorage(storage.minimum) })}
      </span>
    );
  }
  return (
    <span data-testid="plan-tile-storage-range">
      {t('storageSpecRange', {
        min: formatStorage(storage.minimum),
        max: formatStorage(storage.maximum),
      })}
    </span>
  );
};

export default PlanTile;
