import { useTranslation } from 'react-i18next';
import { humanizeEngine } from '@/lib/engineNameHelper';
import { database } from '@/models/database';
import { formatStorage } from '@/lib/bytesHelper';
import { Engine, Flavor, Plan, Region, Version } from '@/models/order-funnel';
import { Skeleton } from '@/components/ui/skeleton';
import { P, Span } from '@/components/typography';
import { Network, Subnet } from '@/models/network';

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
    network: {
      type: database.NetworkTypeEnum;
      network?: Network;
      subnet?: Subnet;
    };
  };
  onSectionClicked: (target: string) => void;
}
const OrderSummary = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t: tRegions } = useTranslation('regions');
  return (
    <div>
      <div>
        <b>Nom :</b>
        <Span>{order.name}</Span>
        <Span>i</Span>
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
              <Span>{`${humanizeEngine(
                order.engine.name as database.EngineEnum,
              )} ${order.version.name}`}</Span>
              <img
                className="block w-[30px] h-[20px]"
                src={`./assets/engines/${order.engine.name}.png`}
              />
            </div>
          ) : (
            <Skeleton className="h-4 w-40" />
          )}
        </div>
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
          <Span>{order.plan.name}</Span>
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
          <Span>
            {tRegions(`region_${order.region.name}_micro`, {
              micro: order.region.name,
            })}
          </Span>
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
            <Span>{order.flavor.name}</Span>
            <Span>{order.flavor.vcores} vCores</Span>
            <Span>{formatStorage(order.flavor.ram)} RAM</Span>
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
        <Span>{order.nodes} nœuds</Span>
        {order.flavor?.storage && (
          <Span>
            {formatStorage({
              value:
                order.additionalStorage + order.flavor.storage.minimum.value,
              unit: order.flavor.storage.minimum.unit,
            })}{' '}
            (dont {formatStorage(order.flavor.storage.minimum)} inclus)
          </Span>
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
        <Span>{order.network.type}</Span>
        {order.network.type === database.NetworkTypeEnum.private && (
          <div className="ml-4">
            <P>
              Network:{' '}
              {order.network.network?.name || (
                <Span className="text-red-500">-</Span>
              )}
            </P>
            <P>
              Subnet:{' '}
              {order.network.subnet?.cidr || (
                <Span className="text-red-500">-</Span>
              )}
            </P>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
