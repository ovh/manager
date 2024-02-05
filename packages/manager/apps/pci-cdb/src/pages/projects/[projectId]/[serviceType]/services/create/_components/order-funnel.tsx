import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { AvailabilityWithType } from '..';
import { Button } from '@/components/ui/button';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { NetworkTypeEnum } from '@/models/vrack';
import { database } from '@/models/database';
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
import EnginesSelect from './engine/engines-select';
import PlansSelect from './plan/plans-select';
import { useGetCatalog } from '@/hooks/api/catalog.api.hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { order } from '@/models/catalog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Price from '@/components/price';

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
  const catalog = useGetCatalog();
  const [monthlyPrices, setMonthlyPrices] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formProps = Object.fromEntries(formData);
    console.log(formProps);
    toast('Deployment in progress', {
      description: <span>{new Date().toDateString()}</span>,
    });
  };

  const getPrice = (
    catalogPrices: order.publicOrder.Catalog,
    availability: database.Availability | undefined,
    monthly = false,
  ) => {
    if (!availability) return <Skeleton className="w-full h-4" />;
    const prefix = `databases.${availability.engine.toLowerCase()}-${
      availability.plan
    }-${availability.specifications.flavor}`;
    const interval = monthly ? 'month' : 'hour';
    const nodePrice = catalogPrices.addons.find(
      (a) => a.planCode === `${prefix}.${interval}.consumption`,
    )?.pricings[0];
    const pricePerGB = catalogPrices.addons.find(
      (a) =>
        a.planCode ===
        `databases.${availability.engine.toLowerCase()}-${
          availability.plan
        }-additionnal-storage-gb.${interval}.consumption`,
    )?.pricings[0];

    const isDistributedStorage = false; // TODO: get is distributed storage
    const additionalStorage = 0; // TODO: get additionnal storage
    const nbNodes = availability.specifications.nodes.minimum; // TODO: get additional nodes
    const storageNodeFactor = isDistributedStorage ? 1 : nbNodes;
    const price = nbNodes * (nodePrice?.price || 0) + additionalStorage * storageNodeFactor * (pricePerGB?.price || 0);
    const tax = nbNodes * (nodePrice?.tax || 0) + additionalStorage * storageNodeFactor * (pricePerGB?.tax || 0);
    return ( 
    <div className="flex">
      <Price decimals={3} priceInUcents={price} taxInUcents={tax} />
      <span className="font-bold">/{monthly ? 'mois' : 'heure'}</span>
    </div>
    )
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
          <EnginesSelect model={model} />

          {/* Plans */}
          <H3>Plan</H3>
          <PlansSelect model={model} />

          {/* Regions */}
          <H3>Region</H3>
          <RegionsSelect model={model} />

          {/* Flavors */}
          <H3>Flavor</H3>
          <FlavorsSelect model={model} />

          <H3>Cluster config</H3>
          <div className="flex flex-col gap-4">
            <NodesConfig model={model} />
            <StorageConfig model={model} />
          </div>

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
            <div>
              {catalog.isSuccess ? (
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <Switch
                      className="rounded-xl"
                      id="price-unit"
                      checked={monthlyPrices}
                      onCheckedChange={(checked) => setMonthlyPrices(checked)}
                    />
                    <Label htmlFor="availabilities-table">Monthly prices</Label>
                  </div>
                  <span>Price: {getPrice(catalog.data, model.availability, monthlyPrices)}</span>
                </div>
              ) : (
                <Skeleton className="w-full h-4" />
              )}
            </div>
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
