import { useState } from 'react';
import StorageConfig from '@/components/Order/cluster-config/storage-config';
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

interface UpdateStorageProps {
  controller: ModalController;
  availabilities: database.Availability[];
  onSuccess?: (service: database.Service) => void;
  onError?: (error: Error) => void;
}

const UpdateStorage = ({
  controller,
  availabilities,
  onSuccess,
  onError,
}: UpdateStorageProps) => {
  const [additionalStorage, setAdditionalStorage] = useState(0);
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update storage</DialogTitle>
          <DialogDescription>Add a description here</DialogDescription>
        </DialogHeader>
        <StorageConfig
          availability={availabilities[0]}
          value={additionalStorage}
          onChange={setAdditionalStorage}
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

export default UpdateStorage;
