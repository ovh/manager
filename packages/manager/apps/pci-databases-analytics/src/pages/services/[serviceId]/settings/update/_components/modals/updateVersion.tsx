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
import { order } from '@/models/catalog';
import { database } from '@/models/database';

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
  onSuccess,
  onError,
}: UpdateVersionProps) => {
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update service version</DialogTitle>
          <DialogDescription>Add a description here</DialogDescription>
        </DialogHeader>
        <ul className="list-disc list-outside">
          {availabilities.map((a) => (
            <li key={a.version} className="list-item">
              {a.version}
            </li>
          ))}
        </ul>
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
