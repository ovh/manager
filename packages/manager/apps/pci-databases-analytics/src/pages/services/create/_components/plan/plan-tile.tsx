import Price from '@/components/price';
import RadioTile from '@/components/radio-tile';
import { formatStorage } from '@/lib/bytesHelper';
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
          <h3
            className={`capitalize ${selected ? 'font-bold' : 'font-normal'}`}
          >
            {plan.name}
          </h3>
          <RadioTile.Separator />
        </div>
        <div className="text-xs flex flex-col">
          {plan.ram && <PlanTile.Ram ram={plan.ram} />}
          {plan.cpu && <PlanTile.Cpu cpu={plan.cpu} />}
          {plan.storage && <PlanTile.Storage storage={plan.storage} />}
          <PlanTile.Nodes nodes={plan.nodes} />
          {plan.backups && <span>Sauvegarde manuelles et automatiques</span>}
          {hasPrivateNetwork && <span>Réseaux privés</span>}
        </div>
        <div>
          <RadioTile.Separator />
          <p className="text-sm">
            A partir de{' '}
            <Price
              priceInUcents={
                plan.minPricing[showMonthlyPrice ? 'monthly' : 'hourly'].price
              }
              taxInUcents={
                plan.minPricing[showMonthlyPrice ? 'monthly' : 'hourly'].tax
              }
              decimals={showMonthlyPrice ? 2 : 3}
            />
            <b>/heure</b>
          </p>
        </div>
      </div>
    </RadioTile>
  );
};

PlanTile.Ram = function PlanTilesRam({ ram }: Partial<Plan>) {
  if (ram.minimum.value === ram.maximum.value) {
    return (
      <span>
        {ram.minimum.value} {ram.minimum.unit} RAM
      </span>
    );
  }
  return (
    <span>
      De {formatStorage(ram.minimum)} à {formatStorage(ram.maximum)} RAM
    </span>
  );
};
PlanTile.Cpu = function PlanTilesCpu({ cpu }: Partial<Plan>) {
  if (cpu.minimum === cpu.maximum) {
    return (
      <span>
        {cpu.minimum} {cpu.minimum === 1 ? 'vCore' : 'vCores'}
      </span>
    );
  }
  return (
    <span>
      De {cpu.minimum} à {cpu.maximum} vCores
    </span>
  );
};
PlanTile.Nodes = function PlanTilesNodes({ nodes }: Partial<Plan>) {
  if (nodes.minimum === nodes.maximum) {
    return (
      <span>
        {nodes.minimum} {nodes.minimum === 1 ? 'nœud' : 'nœuds'}
      </span>
    );
  }
  return (
    <span>
      De {nodes.minimum} à {nodes.maximum} nœuds
    </span>
  );
};

PlanTile.Storage = function PlanTileStorage({ storage }: Partial<Plan>) {
  if (
    storage.minimum.value === storage.maximum.value &&
    storage.minimum.unit === storage.maximum.unit
  ) {
    return <span>{formatStorage(storage.minimum)} de stockage</span>;
  }
  return (
    <span>
      De {formatStorage(storage.minimum)} à {formatStorage(storage.maximum)} de
      stockage
    </span>
  );
};

export default PlanTile;
