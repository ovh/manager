import { useMemo, useState } from 'react';
import PlansSelect from '@/components/Order/plan/plan-select';
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
import { FullCapabilities } from '@/hooks/api/availabilities.api.hooks';
import { ModalController } from '@/hooks/useModale';
import { createTree } from '@/lib/availabilitiesHelper';
import { order } from '@/models/catalog';
import { database } from '@/models/database';
import { Engine, Version } from '@/models/order-funnel';
import { useServiceData } from '@/pages/services/[serviceId]/layout';

interface UpdatePlanProps {
  controller: ModalController;
  availabilities: database.Availability[];
  capabilities: FullCapabilities;
  catalog: order.publicOrder.Catalog;
  onSuccess?: (service: database.Service) => void;
  onError?: (error: Error) => void;
}

const UpdatePlan = ({
  controller,
  availabilities,
  capabilities,
  catalog,
  onSuccess,
  onError,
}: UpdatePlanProps) => {
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
  const listPlans = useMemo(
    () =>
      listEngines
        ?.find((e: Engine) => e.name === service.engine)
        ?.versions.find((v: Version) => v.name === service.version)
        ?.plans.sort((a, b) => a.order - b.order) || [],
    [listEngines, service],
  );
  const [selectedPlan, setSelectedPlan] = useState(service.plan);
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update service plan</DialogTitle>
          <DialogDescription>Add a description here</DialogDescription>
        </DialogHeader>
        <ul className="list-disc list-outside">
          {availabilities.map((a) => (
            <li key={a.plan} className="list-item">
              {a.plan}
            </li>
          ))}
        </ul>
        <PlansSelect
          plans={listPlans}
          value={selectedPlan}
          onChange={(newPlan) => setSelectedPlan(newPlan)}
        />
        <DialogFooter className="flex justify-end">
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

export default UpdatePlan;
