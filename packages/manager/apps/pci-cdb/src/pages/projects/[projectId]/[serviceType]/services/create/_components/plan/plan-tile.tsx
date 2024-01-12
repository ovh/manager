import { Plan } from '@/models/dto/OrderFunnel';
import RadioTile from '@/components/radio-tile';

export const PlanTile = ({
  plan,
  selected,
  onChange,
}: {
  plan: Plan;
  selected: boolean;
  onChange: (newPlan: string) => void;
}) => {
  return (
    <RadioTile
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
          <PlanTile.Ram ram={plan.ram} />
          <PlanTile.Cpu cpu={plan.cpu} />
          <PlanTile.Nodes nodes={plan.nodes} />
          <span>Sauvegarde manuelles et automatiques</span>
          <span>Réseaux privés</span>
        </div>
        <div>
          <RadioTile.Separator />
          <p className="text-sm">
            A partir de{' '}
            <b>{(Math.random() * (2 - 0.059) + 0.059).toFixed(3)} € /heure</b>
          </p>
        </div>
      </div>
    </RadioTile>
  );
};

PlanTile.Ram = function PlanTilesRam({ ram }: Partial<Plan>) {
  if (!ram || ram.maximum.value === 0) return <></>;
  if (ram.minimum.value === ram.maximum.value) {
    return (
      <span>
        {ram.minimum.value} {ram.minimum.unit} RAM
      </span>
    );
  }
  return (
    <span>
      De {ram.minimum.value} {ram.minimum.unit} à {ram.maximum.value}{' '}
      {ram.maximum.unit} RAM
    </span>
  );
};
PlanTile.Cpu = function PlanTilesCpu({ cpu }: Partial<Plan>) {
  if (!cpu || cpu.maximum === 0) return <></>;
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
  if (!nodes || nodes.maximum === 0) return <></>;
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

export default PlanTile;
