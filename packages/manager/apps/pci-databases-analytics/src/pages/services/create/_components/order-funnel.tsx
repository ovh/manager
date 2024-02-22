import { FormEvent, useState } from 'react';
import { H3 } from '@/components/typography';
import { useOrderFunnel } from '@/hooks/useOrderFunnel';
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
import { useToast } from '@/components/ui/use-toast';
import PlansSelect from './plan/plan-select';
import RegionsSelect from './region/region-select';
import FlavorsSelect from './flavor/flavor-select';
import StorageConfig from './cluster-config/storage-config';
import NodesConfig from './cluster-config/nodes-config';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Price from '@/components/price';
import OrderSummary from './order-summary';
import NetworkOptions from './cluster-options/network-options';

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
  const model = useOrderFunnel(
    availabilities,
    capabilities,
    engineCapabilities,
    regionCapabilities,
    suggestions,
    catalog,
  );
  const [showMonthlyPrice, setshowMonthlyPrice] = useState(false);
  const { toast } = useToast();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: 'Deployment in progress',
      description: (
        <div className="flex flex-col">
          <span>{new Date().toDateString()}</span>
          <span>Engine: {model.form.engineWithVersion.engine}</span>
          <span>Version: {model.form.engineWithVersion.version}</span>
          <span>Plan: {model.form.plan}</span>
          <span>Region: {model.form.region}</span>
          <span>Flavor: {model.form.flavor}</span>
          <span>nbNodes: {model.form.nbNodes}</span>
          <span>additionalStorage: {model.form.additionalStorage}</span>
          <span>network: {}</span>
        </div>
      ),
    });
  };

  const scrollToDiv = (target: string) => {
    const div = document.getElementById(target);
    if (div) {
      div.scrollIntoView({ behavior: 'smooth' });
    }
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
          <section id="engine">
            <H3>Engine</H3>
            <EnginesSelect
              engines={model.lists.engines}
              value={model.form.engineWithVersion}
              onChange={(newEngineWithVersion) =>
                model.form.setEngineWithVersion(newEngineWithVersion)
              }
            />
          </section>
          <section id="plan">
            <H3>Plan</H3>
            <PlansSelect
              plans={model.lists.plans}
              value={model.form.plan}
              onChange={(newPlan) => model.form.setPlan(newPlan)}
              showMonthlyPrice={showMonthlyPrice}
            />
          </section>
          <section id="region"></section>
          <H3>Region</H3>
          <RegionsSelect
            regions={model.lists.regions}
            onChange={(newRegion) => model.form.setRegion(newRegion)}
            value={model.form.region}
          />
          <section id="flavor"></section>
          <H3>Flavor</H3>
          <FlavorsSelect
            flavors={model.lists.flavors}
            value={model.form.flavor}
            onChange={(newFlavor) => model.form.setFlavor(newFlavor)}
            showMonthlyPrice={showMonthlyPrice}
          />
          {model.result.availability &&
            (model.result.plan?.nodes.minimum !==
              model.result.plan?.nodes.maximum ||
              model.result.flavor?.storage?.minimum !==
                model.result.flavor?.storage?.maximum) && (
              <section id="cluster">
                <H3>Cluster config</H3>
                <div className="flex flex-col gap-4">
                  <NodesConfig
                    minimum={model.result.plan.nodes.minimum}
                    maximum={model.result.plan.nodes.maximum}
                    value={model.form.nbNodes}
                    onChange={(newNbNodes) => model.form.setNbNodes(newNbNodes)}
                  />
                  <StorageConfig
                    availability={model.result.availability}
                    value={model.form.additionalStorage}
                    onChange={(newStorage) =>
                      model.form.setAdditionalStorage(newStorage)
                    }
                  />
                </div>
              </section>
            )}
          <section id="options">
            <H3>Options</H3>
            <NetworkOptions
              region={model.form.region}
              networkType={database.NetworkTypeEnum.private}
              onNetworkTypeChange={() => {}}
            />
          </section>
        </div>

        <Card className="sticky mt-16 top-8 h-fit shadow-lg">
          <CardHeader>
            <CardTitle>Votre commande</CardTitle>
            <CardDescription>Configuration de votre service</CardDescription>
          </CardHeader>
          <CardContent>
            <OrderSummary
              engine={model.result.engine}
              flavor={model.result.flavor}
              additionalStorage={model.result.additionalStorage}
              nbNodes={model.result.nodes}
              plan={model.result.plan}
              region={model.result.region}
              version={model.result.verion}
              onSectionClicked={(section) => scrollToDiv(section)}
            />
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
                <div className="flex items-baseline">
                  <Price
                    decimals={showMonthlyPrice ? 2 : 3}
                    priceInUcents={
                      model.result.price[
                        showMonthlyPrice ? 'monthly' : 'hourly'
                      ].price
                    }
                    taxInUcents={
                      model.result.price[
                        showMonthlyPrice ? 'monthly' : 'hourly'
                      ].tax
                    }
                  />
                  {showMonthlyPrice ? '/mois' : '/heure'}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button className="w-full">Commander</Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default OrderFunnel;
