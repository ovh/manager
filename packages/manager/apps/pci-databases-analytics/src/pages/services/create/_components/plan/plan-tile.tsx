import { useTranslation } from 'react-i18next';
import Price from '@/components/price';
import RadioTile from '@/components/radio-tile';
import { H5, P, Span } from '@/components/typography';
import { compareStorage, formatStorage } from '@/lib/bytesHelper';
import { database } from '@/models/database';
import { Plan } from '@/models/order-funnel';

export const PlanTile = ({
  plan,
  selected,
  onChange,
  showMonthlyPrice = false,
}: {
  plan: Plan;
  selected: boolean;
  onChange: (newPlan: string) => void;
  showMonthlyPrice: boolean;
}) => {
  const { t } = useTranslation('pci-databases-analytics/components/plan');
  const { t: tPricing } = useTranslation('pricing');
  const pricingUnit = showMonthlyPrice ? 'monthly' : 'hourly';
  const hasPrivateNetwork = plan.networks.includes(
    database.NetworkTypeEnum.private,
  );
  return (
    <RadioTile
      name="plan-select"
      onChange={() => onChange(plan.name)}
      value={plan.name}
      checked={selected}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <H5
            className={`capitalize ${selected ? 'font-bold' : 'font-normal'}`}
          >
            {plan.name}
          </H5>
          <RadioTile.Separator />
        </div>
        <div className="text-xs flex flex-col">
          <PlanTile.Ram ram={plan.ram} />
          <PlanTile.Cpu cpu={plan.cpu} />
          <PlanTile.Storage storage={plan.storage} />
          <PlanTile.Nodes nodes={plan.nodes} />
          {plan.backups && <Span>{t('backupsSpec')}</Span>}
          {hasPrivateNetwork && <Span>{t('privateNetworkSpec')}</Span>}
        </div>
        <div>
          <RadioTile.Separator />
          <P className="text-sm">
            <Span>{t('priceStartingFrom')} </Span>
            <Price
              priceInUcents={plan.minPricing[pricingUnit].price}
              taxInUcents={plan.minPricing[pricingUnit].tax}
              decimals={showMonthlyPrice ? 2 : 3}
            />
            <b> {tPricing(`pricing_unit_${pricingUnit}`)}</b>
          </P>
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
      <Span>{t('memorySpec', { memory: formatStorage(ram.minimum) })}</Span>
    );
  }
  return (
    <Span>
      {t('memorySpecRange', {
        min: formatStorage(ram.minimum),
        max: formatStorage(ram.maximum),
      })}
    </Span>
  );
};
PlanTile.Cpu = function PlanTilesCpu({ cpu }: Partial<Plan>) {
  const { t } = useTranslation('pci-databases-analytics/components/plan');
  if (!cpu || cpu.maximum === 0) return <></>;
  if (cpu.minimum === cpu.maximum) {
    return <Span>{t('cpuSpec', { count: cpu.minimum })}</Span>;
  }
  return (
    <Span>
      {t('cpuSpecRange', {
        min: cpu.minimum,
        max: cpu.maximum,
      })}
    </Span>
  );
};
PlanTile.Nodes = function PlanTilesNodes({ nodes }: Partial<Plan>) {
  const { t } = useTranslation('pci-databases-analytics/components/plan');
  if (!nodes || nodes.maximum === 0) return <></>;
  if (nodes.minimum === nodes.maximum) {
    return <Span>{t('nodeSpec', { count: nodes.minimum })}</Span>;
  }
  return (
    <Span>
      {t('nodeSpecRange', {
        min: nodes.minimum,
        max: nodes.maximum,
      })}
    </Span>
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
      <Span>
        {t('storageSpec', { storage: formatStorage(storage.minimum) })}
      </Span>
    );
  }
  return (
    <Span>
      {t('storageSpecRange', {
        min: formatStorage(storage.minimum),
        max: formatStorage(storage.maximum),
      })}
    </Span>
  );
};

export default PlanTile;
