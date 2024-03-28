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
import { ModalController } from '@/hooks/useModale';
import { database } from '@/models/database';

interface UpdateFlavorProps {
  controller: ModalController;
  availabilities: database.Availability[];
  onSuccess?: (service: database.Service) => void;
  onError?: (error: Error) => void;
}

const UpdateFlavor = ({
  controller,
  availabilities,
  onSuccess,
  onError,
}: UpdateFlavorProps) => {
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update service flavor</DialogTitle>
          <DialogDescription>Add a description here</DialogDescription>
        </DialogHeader>
        <ul className="list-disc list-outside">
          {availabilities.map((a) => (
            <li key={a.specifications.flavor} className="list-item">
              {a.specifications.flavor}
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

export default UpdateFlavor;
