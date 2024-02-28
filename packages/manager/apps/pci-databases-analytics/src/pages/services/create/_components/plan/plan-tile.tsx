import Price from '@/components/price';
import RadioTile from '@/components/radio-tile';
import { H5, P, Span } from '@/components/typography';
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
          <H5
            className={`capitalize ${selected ? 'font-bold' : 'font-normal'}`}
          >
            {plan.name}
          </H5>
          <RadioTile.Separator />
        </div>
        <div className="text-xs flex flex-col">
          {plan.ram && <PlanTile.Ram ram={plan.ram} />}
          {plan.cpu && <PlanTile.Cpu cpu={plan.cpu} />}
          {plan.storage && <PlanTile.Storage storage={plan.storage} />}
          <PlanTile.Nodes nodes={plan.nodes} />
          {plan.backups && <Span>Sauvegarde manuelles et automatiques</Span>}
          {hasPrivateNetwork && <Span>Réseaux privés</Span>}
        </div>
        <div>
          <RadioTile.Separator />
          <P className="text-sm">
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
          </P>
        </div>
      </div>
    </RadioTile>
  );
};

PlanTile.Ram = function PlanTilesRam({ ram }: Partial<Plan>) {
  if (ram.minimum.value === ram.maximum.value) {
    return (
      <Span>
        {ram.minimum.value} {ram.minimum.unit} RAM
      </Span>
    );
  }
  return (
    <Span>
      De {formatStorage(ram.minimum)} à {formatStorage(ram.maximum)} RAM
    </Span>
  );
};
PlanTile.Cpu = function PlanTilesCpu({ cpu }: Partial<Plan>) {
  if (cpu.minimum === cpu.maximum) {
    return (
      <Span>
        {cpu.minimum} {cpu.minimum === 1 ? 'vCore' : 'vCores'}
      </Span>
    );
  }
  return (
    <Span>
      De {cpu.minimum} à {cpu.maximum} vCores
    </Span>
  );
};
PlanTile.Nodes = function PlanTilesNodes({ nodes }: Partial<Plan>) {
  if (nodes.minimum === nodes.maximum) {
    return (
      <Span>
        {nodes.minimum} {nodes.minimum === 1 ? 'nœud' : 'nœuds'}
      </Span>
    );
  }
  return (
    <Span>
      De {nodes.minimum} à {nodes.maximum} nœuds
    </Span>
  );
};

PlanTile.Storage = function PlanTileStorage({ storage }: Partial<Plan>) {
  if (
    storage.minimum.value === storage.maximum.value &&
    storage.minimum.unit === storage.maximum.unit
  ) {
    return <Span>{formatStorage(storage.minimum)} de stockage</Span>;
  }
  return (
    <Span>
      De {formatStorage(storage.minimum)} à {formatStorage(storage.maximum)} de
      stockage
    </Span>
  );
};

export default PlanTile;
