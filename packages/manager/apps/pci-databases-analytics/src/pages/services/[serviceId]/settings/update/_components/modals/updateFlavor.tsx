import { useMemo, useState } from 'react';
import FlavorsSelect from '@/components/Order/flavor/flavor-select';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { FullCapabilities } from '@/hooks/api/availabilities.api.hooks';
import { ModalController } from '@/hooks/useModale';
import { createTree } from '@/lib/availabilitiesHelper';
import { order } from '@/models/catalog';
import { database } from '@/models/database';
import { Engine, Version, Plan, Region } from '@/models/order-funnel';
import { useServiceData } from '@/pages/services/[serviceId]/layout';

interface UpdateFlavorProps {
  controller: ModalController;
  availabilities: database.Availability[];
  capabilities: FullCapabilities;
  catalog: order.publicOrder.Catalog;
  onSuccess?: (service: database.Service) => void;
  onError?: (error: Error) => void;
}

const UpdateFlavor = ({
  controller,
  availabilities,
  capabilities,
  catalog,
  onSuccess,
  onError,
}: UpdateFlavorProps) => {
  const { service, projectId } = useServiceData();
  const suggestions: database.Suggestion[] = [
    {
      default: true,
      engine: service.engine,
      flavor: service.flavor,
      plan: service.plan,
      region: service.region,
      version: service.version,
    },
  ];
  const listEngines = useMemo(
    () =>
      createTree(availabilities, capabilities, suggestions, catalog).map(
        (e) => {
          // order the versions in the engines
          e.versions.sort((a, b) => a.order - b.order);
          return e;
        },
      ),
    [availabilities, capabilities],
  );
  const listFlavors = useMemo(
    () =>
      listEngines
        ?.find((e: Engine) => e.name === service.engine)
        ?.versions.find((v: Version) => v.name === service.version)
        ?.plans.find((p: Plan) => p.name === service.plan)
        ?.regions.find((r: Region) => r.name === service.nodes[0].region)
        ?.flavors.sort((a, b) => a.order - b.order) || [],
    [listEngines, service],
  );
  const [selectedFlavor, setSelectedFlavor] = useState(service.flavor);
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update service flavor</DialogTitle>
        </DialogHeader>
        <ScrollArea>
          <div className="w-max">
            <FlavorsSelect
              flavors={listFlavors}
              value={selectedFlavor}
              onChange={(newFlavor) => setSelectedFlavor(newFlavor)}
            />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <DialogFooter className="flex justify-end px-6">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button">Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateFlavor;
