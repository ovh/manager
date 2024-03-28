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

interface DeleteNodeProps {
  controller: ModalController;
  onSuccess?: (service: database.Service) => void;
  onError?: (error: Error) => void;
}

const DeleteNode = ({ controller, onSuccess, onError }: DeleteNodeProps) => {
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete a node</DialogTitle>
          <DialogDescription>Add a description here</DialogDescription>
        </DialogHeader>
        Ask confirm
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNode;
