import { useTranslation } from 'react-i18next';
import { humanizeEngine } from '@/lib/engineNameHelper';
import { database } from '@/models/database';
import { formatStorage } from '@/lib/bytesHelper';
import { Engine, Flavor, Plan, Region, Version } from '@/models/order-funnel';
import { Skeleton } from '@/components/ui/skeleton';

interface OrderSummaryProps {
  engine: Engine;
  version: Version;
  plan: Plan;
  region: Region;
  flavor: Flavor;
  nbNodes: number;
  additionalStorage: number;
  onSectionClicked: (target: string) => void;
}
const OrderSummary = ({
  engine,
  version,
  plan,
  region,
  flavor,
  nbNodes,
  additionalStorage,
  onSectionClicked,
}: OrderSummaryProps) => {
  const { t: tRegions } = useTranslation('regions');
  return (
    <div>
      <div>
        <b>Nom :</b>
        <span>nameToGenerate</span>
        <span>i</span>
      </div>
      <div>
        <div className="flex">
          <button
            type="button"
            onClick={() => onSectionClicked('engine')}
            className="font-bold"
          >
            Service :
          </button>
          {engine ? (
            <div className="flex items-center">
              {humanizeEngine(engine.name as database.EngineEnum)}
              <img
                className="block w-[60px] h-[40px]"
                src={`./assets/engines/${engine.name}.png`}
              />
            </div>
          ) : (
            <Skeleton className="h-4 w-40" />
          )}
        </div>
        {version ? (
          <div className="pl-4">Version {version.name}</div>
        ) : (
          <Skeleton className="h-4 w-20" />
        )}
      </div>
      <div>
        <button
          type="button"
          onClick={() => onSectionClicked('plan')}
          className="font-bold"
        >
          Offre :
        </button>
        {plan ? <span>{plan.name}</span> : <Skeleton className="h-4 w-20" />}
      </div>
      <div>
        <button
          type="button"
          onClick={() => onSectionClicked('region')}
          className="font-bold"
        >
          Datacentre :
        </button>
        {region ? (
          <span>
            {tRegions(`region_${region.name}_micro`, {
              micro: region.name,
            })}
          </span>
        ) : (
          <Skeleton className="h-4 w-20" />
        )}
      </div>
      <div>
        <button
          type="button"
          onClick={() => onSectionClicked('flavor')}
          className="font-bold"
        >
          Modèle de nœud :
        </button>
        {flavor ? (
          <>
            <span>{flavor.name}</span>
            <span>{flavor.vcores} vCores</span>
            <span>{formatStorage(flavor.ram)} RAM</span>
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
        <button
          type="button"
          onClick={() => onSectionClicked('cluster')}
          className="font-bold"
        >
          Cluster :
        </button>
        <span>{nbNodes} nœuds</span>
        {flavor?.storage && (
          <span>
            {formatStorage({
              value: additionalStorage + flavor.storage.minimum.value,
              unit: flavor.storage.minimum.unit,
            })}{' '}
            (dont {formatStorage(flavor.storage.minimum)} inclus)
          </span>
        )}
      </div>
      <div>
        <button
          type="button"
          onClick={() => onSectionClicked('options')}
          className="font-bold"
        >
          Type de réseau :
        </button>
        <span>TODO</span>
      </div>
    </div>
  );
};

export default OrderSummary;
