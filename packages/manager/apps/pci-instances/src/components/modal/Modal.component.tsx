import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  Button,
} from '@datatr-ux/uxlib';

const Modal = ({
  title,
  handleModalClose,
  children,
  isPending,
  handleInstanceAction,
}: {
  title: string;
  handleModalClose: () => void;
  children: React.ReactNode;
  isPending: boolean;
  handleInstanceAction: () => void;
}) => {
  return (
    <Dialog defaultOpen onOpenChange={handleModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="neutral" mode="ghost" onClick={handleModalClose}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={isPending}
              variant="primary"
              onClick={handleInstanceAction}
            >
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
