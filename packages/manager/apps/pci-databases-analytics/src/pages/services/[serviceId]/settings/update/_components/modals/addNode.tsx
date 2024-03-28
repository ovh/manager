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

interface AddNodeProps {
  controller: ModalController;
  onSuccess?: (service: database.Service) => void;
  onError?: (error: Error) => void;
}

const AddNode = ({ controller, onSuccess, onError }: AddNodeProps) => {
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a node</DialogTitle>
          <DialogDescription>Add a description here</DialogDescription>
        </DialogHeader>
        info about new node (price)
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button">Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNode;
