import { FormEvent } from 'react';
import { toast } from 'sonner';
import { AvailabilityWithType } from '..';
import { Button } from '@/components/ui/button';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { useVrack } from '@/hooks/useVrack';
import { Network } from '@/models/vrack';
import { Skeleton } from '@/components/ui/skeleton';
import { database } from '@/models/database';
import { Engine, Flavor, Region, Version } from '@/models/dto/OrderFunnel';
import PlanTile from './plan/plan-tile';
import EngineTile from './engine/engine-tile';
import { H3 } from '@/components/typography';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import RegionsSelect from './region/regions-select';

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
    toast('Deployment in progress', {
      description: <span>{new Date().toDateString()}</span>,
    });
  };

  return (
    <>
      <h3 className="font-bold text-3xl mb-5">Create a database service</h3>
      <p>
        Create a database service available in your Public Cloud project. If you
        would like to use a private network that does not yet exist, please
        create{' '}
        <a className="text-primary font-bold" href="#">
          a private network or subnet
        </a>{' '}
        first.
      </p>
      <form
        className="grid grid-cols-1 lg:grid-cols-4 gap-4"
        onSubmit={handleSubmit}
      >
        <div className="col-span-1 md:col-span-3">
          {/* Engines */}
          <H3>Engine</H3>
          <div className="mb-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            {model.listEngines.map((engine) => (
              <EngineTile
                key={engine.name}
                engine={engine}
                version={
                  engine.name === model.engine.engine
                    ? engine.versions.find(
                        (v) => v.name === model.engine.version,
                      ) ?? engine.versions[0]
                    : engine.versions[0]
                }
                selected={engine.name === model.engine.engine}
                onChange={(newEngine: Engine, newVersion: Version) => {
                  model.setEngine(() => ({
                    engine: newEngine.name,
                    version: newVersion.name,
                  }));
                }}
              />
            ))}
          </div>

          {/* Plans */}
          <H3>Plan</H3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            {model.listPlans.map((plan) => (
              <PlanTile
                key={plan.name}
                plan={plan}
                selected={model.plan === plan.name}
                onChange={(value: string) => model.setPlan(value)}
              />
            ))}
          </div>

          <H3>Region</H3>
          <RegionsSelect
            listRegions={model.listRegions}
            selectedRegion={model.region}
            onChange={(newRegion) => model.setRegion(newRegion)}
          />

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
        </div>

        <Card className="sticky mt-16 top-8 h-fit shadow-lg">
          <CardHeader>
            <CardTitle>Votre commande</CardTitle>
            <CardDescription>Configuration de votre service</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="rounded-md bg-primary-800 text-primary-100 text-xs max-h-80 overflow-y-auto">
              {model.availability
                ? JSON.stringify(model.availability, null, 2)
                : 'loading...'}
            </pre>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button className="w-full">Deploy</Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};
export default OrderFunnel;
