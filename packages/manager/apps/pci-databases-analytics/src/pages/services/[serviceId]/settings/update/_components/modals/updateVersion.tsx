import { useMemo, useState } from 'react';
import VersionSelector from '@/components/Order/engine/engine-tile-version';
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
import { Engine } from '@/models/order-funnel';
import { useServiceData } from '@/pages/services/[serviceId]/layout';

interface UpdateVersionProps {
  controller: ModalController;
  availabilities: database.Availability[];
  capabilities: FullCapabilities;
  catalog: order.publicOrder.Catalog;
  onSuccess?: (service: database.Service) => void;
  onError?: (error: Error) => void;
}

const UpdateVersion = ({
  controller,
  availabilities,
  capabilities,
  catalog,
  onSuccess,
  onError,
}: UpdateVersionProps) => {
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
  const listVersions = useMemo(
    () =>
      listEngines?.find((e: Engine) => e.name === service.engine)?.versions ||
      [],
    [listEngines, service],
  );
  const [selectedVersion, setSelectedVersion] = useState(
    listVersions.find((v) => v.name === service.version),
  );
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update service version</DialogTitle>
          <DialogDescription>Add a description here</DialogDescription>
        </DialogHeader>
        <VersionSelector
          isEngineSelected
          versions={listVersions}
          selectedVersion={selectedVersion}
          onChange={setSelectedVersion}
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

export default UpdateVersion;
