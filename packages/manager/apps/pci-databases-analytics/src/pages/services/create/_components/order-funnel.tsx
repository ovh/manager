import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { H3 } from '@/components/typography';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import { order } from '@/models/catalog';
import { database } from '@/models/database';
import EnginesSelect from './engine/engine-select';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import PlansSelect from './plan/plan-select';
import RegionsSelect from './region/region-select';
import FlavorsSelect from '../flavor/flavor-select';
import StorageConfig from './cluster-config/storage-config';
import NodesConfig from './cluster-config/nodes-config';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface OrderFunnelProps {
  availabilities: database.Availability[];
  capabilities: database.Capabilities;
  engineCapabilities: database.EngineCapabilities[];
  regionCapabilities: database.RegionCapabilities[];
  suggestions: database.Suggestion[];
  catalog: order.publicOrder.Catalog;
}

const OrderFunnel = ({
  availabilities,
  capabilities,
  engineCapabilities,
  regionCapabilities,
  suggestions,
  catalog,
}: OrderFunnelProps) => {
  const model = useAvailabilities(
    availabilities,
    capabilities,
    engineCapabilities,
    regionCapabilities,
    suggestions,
    catalog,
  );
  const [showMonthlyPrice, setshowMonthlyPrice] = useState(false);
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
          <EnginesSelect model={model} />

          {/* Plans */}
          <H3>Plan</H3>
          <PlansSelect model={model} showMonthlyPrice={showMonthlyPrice} />

          {/* Regions */}
          <H3>Region</H3>
          <RegionsSelect model={model} />

          {/* Flavors */}
          <H3>Flavor</H3>
          <FlavorsSelect model={model} showMonthlyPrice={showMonthlyPrice} />

          <H3>Cluster config</H3>
          <div className="flex flex-col gap-4">
            <NodesConfig model={model} />
            <StorageConfig model={model} />
          </div>

          <H3>Options</H3>
          {/* <NetworkOptions
            projectId={projectId}
            region={model.region}
            networkType={networkType}
            onNetworkTypeChange={(newNetwork) => setNetworkType(newNetwork)}
          /> */}
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
              <div className="flex flex-col">
                <div className="flex items-center space-x-2 mb-2">
                  <Switch
                    className="rounded-xl"
                    id="price-unit"
                    checked={showMonthlyPrice}
                    onCheckedChange={(checked) => setshowMonthlyPrice(checked)}
                  />
                  <Label htmlFor="availabilities-table">Monthly prices</Label>
                </div>
                <span>Price: TODO</span>
              </div>
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
