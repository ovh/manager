import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { AvailabilityWithType } from '..';
import { Button } from '@/components/ui/button';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { NetworkTypeEnum } from '@/models/vrack';
import { database } from '@/models/database';
import { Engine, Version } from '@/models/dto/OrderFunnel';
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
import FlavorsSelect from './flavor/flavors-select';
import NetworkOptions from './cluster-options/network-options';
import NodesConfig from './cluster-config/nodes-config';
import StorageConfig from './cluster-config/storage-config';

const OrderFunnel = ({
  availabilities,
  capabilities,
}: {
  availabilities: AvailabilityWithType[];
  capabilities: database.Capabilities;
}) => {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const model = useAvailabilities(availabilities, capabilities);
  const [networkType, setNetworkType] = useState<NetworkTypeEnum>(
    NetworkTypeEnum.public,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formProps = Object.fromEntries(formData);
    console.log(formProps);
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

          <H3>Flavor</H3>
          <FlavorsSelect
            listFlavors={model.listFlavors}
            selectedFlavor={model.flavor}
            onChange={(newFlavor) => model.setFlavor(newFlavor)}
          />
          <H3>Cluster config</H3>
          {model.availability && (
            <div className="flex flex-col gap-4">
              <NodesConfig availability={model.availability} />
              <StorageConfig availability={model.availability} />
            </div>
          )}

          <H3>Options</H3>
          <NetworkOptions
            projectId={projectId}
            region={model.region}
            networkType={networkType}
            onNetworkTypeChange={(newNetwork) => setNetworkType(newNetwork)}
          />
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
