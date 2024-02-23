import { useTranslation } from 'react-i18next';
import { humanizeEngine } from '@/lib/engineNameHelper';
import { database } from '@/models/database';
import { formatStorage } from '@/lib/bytesHelper';
import { Engine, Flavor, Plan, Region, Version } from '@/models/order-funnel';
import { Skeleton } from '@/components/ui/skeleton';

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
  };
  onSectionClicked: (target: string) => void;
}
const OrderSummary = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t: tRegions } = useTranslation('regions');
  return (
    <div>
      <div>
        <b>Nom :</b>
        <span>{order.name}</span>
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
          {order.engine ? (
            <div className="flex items-center">
              {humanizeEngine(order.engine.name as database.EngineEnum)}
              <img
                className="block w-[60px] h-[40px]"
                src={`./assets/engines/${order.engine.name}.png`}
              />
            </div>
          ) : (
            <Skeleton className="h-4 w-40" />
          )}
        </div>
        {order.version ? (
          <div className="pl-4">Version {order.version.name}</div>
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
        {order.plan ? (
          <span>{order.plan.name}</span>
        ) : (
          <Skeleton className="h-4 w-20" />
        )}
      </div>
      <div>
        <button
          type="button"
          onClick={() => onSectionClicked('region')}
          className="font-bold"
        >
          Datacentre :
        </button>
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
      <div>
        <button
          type="button"
          onClick={() => onSectionClicked('flavor')}
          className="font-bold"
        >
          Modèle de nœud :
        </button>
        {order.flavor ? (
          <>
            <span>{order.flavor.name}</span>
            <span>{order.flavor.vcores} vCores</span>
            <span>{formatStorage(order.flavor.ram)} RAM</span>
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
        <span>{order.nodes} nœuds</span>
        {order.flavor?.storage && (
          <span>
            {formatStorage({
              value:
                order.additionalStorage + order.flavor.storage.minimum.value,
              unit: order.flavor.storage.minimum.unit,
            })}{' '}
            (dont {formatStorage(order.flavor.storage.minimum)} inclus)
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
