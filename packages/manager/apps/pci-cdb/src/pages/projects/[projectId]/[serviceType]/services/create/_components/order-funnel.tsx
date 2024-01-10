import { FormEvent } from 'react';
import { AvailabilityWithType } from '..';
import EngineSelect from './engines-select';
import { Button } from '@/components/ui/button';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { useVrack } from '@/hooks/useVrack';
import { Network } from '@/models/vrack';
import { Skeleton } from '@/components/ui/skeleton';
import { database } from '@/models/database';
import { Flavor, Plan, Region } from '@/models/dto/OrderFunnel';

const OrderFunnel = ({
  availabilities,
  capabilities,
}: {
  availabilities: AvailabilityWithType[];
  capabilities: database.Capabilities;
}) => {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const model = useAvailabilities(availabilities, capabilities);
  const vrack = useVrack(projectId, model.region);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-1">
      <form onSubmit={handleSubmit}>
        <EngineSelect
          selectedEngine={model.engine.engine}
          onChange={(value: { engine: string; version: string }) => {
            model.setEngine(() => ({
              engine: value.engine,
              version: value.version,
            }));
          }}
          listEngines={model.listEngines}
          selectedVersion={model.engine.version}
        />

        <div className="flex items-center mb-2">
          <label className="mr-2">Plan:</label>
          <select
            className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 justify-between"
            value={model.plan}
            onChange={(event) => model.setPlan(event.target.value)}
          >
            {model.listPlans &&
              model.listPlans.map((plan: Plan, index: number) => (
                <option key={index} value={plan.name}>
                  {plan.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex items-center mb-2">
          <label className="mr-2">Region:</label>
          <select
            className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 justify-between"
            value={model.region}
            onChange={(event) => model.setRegion(event.target.value)}
          >
            {model.listRegions &&
              model.listRegions.map((region: Region, index: number) => (
                <option key={index} value={region.name}>
                  {region.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex items-center mb-2">
          <label className="mr-2">Flavor:</label>
          <select
            className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 justify-between"
            value={model.flavor}
            onChange={(event) => model.setFlavor(event.target.value)}
          >
            {model.listFlavors &&
              model.listFlavors.map((flavor: Flavor, index: number) => (
                <option key={index} value={flavor.name}>
                  {flavor.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          {vrack.networkQuery.isLoading && (
            <div className="flex items-center mb-2">
              <label className="mr-2">Network:</label>
              <Skeleton className="h-10 w-32" />
            </div>
          )}
          {vrack.networkQuery.isSuccess &&
            (vrack.networks.length > 0 ? (
              <div className="flex items-center mb-2">
                <label className="mr-2">Network:</label>
                <select
                  className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 justify-between"
                  value={vrack.selectedNetwork}
                  onChange={(event) =>
                    vrack.setSelectedNetwork(event.target.value)
                  }
                >
                  {vrack.networks.map((network: Network, index: number) => (
                    <option key={index} value={network.id}>
                      {network.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p>You don't have a network for this region</p>
            ))}
        </div>
        <div>
          {vrack.subnetQuery.isLoading && (
            <div className="flex items-center mb-2">
              <label className="mr-2">Subnet:</label>
              <Skeleton className="h-10 w-32" />
            </div>
          )}
          {vrack.subnetQuery.isSuccess &&
            (vrack.subnets.length > 0 ? (
              <div className="flex items-center mb-2">
                <label className="mr-2">Subnet:</label>
                <select
                  className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 justify-between"
                  value={vrack.selectedSubnet}
                  onChange={(event) =>
                    vrack.setSelectedSubnet(event.target.value)
                  }
                >
                  {vrack.subnets.map((subnet, index) => (
                    <option key={index} value={subnet.id}>
                      {subnet.cidr}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p>You don't have a subnet for this region</p>
            ))}
        </div>
        <Button>Submit</Button>
      </form>
      {model.availability && (
        <pre className="rounded-md bg-primary-800 text-primary-100 text-xs max-h-96 overflow-y-auto">
          {JSON.stringify(model.availability, null, 2)}
        </pre>
      )}
    </div>
  );
};
export default OrderFunnel;
