import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  Skeleton,
} from '@datatr-ux/uxlib';

interface RouteModalProps {
  backUrl?: string;
  isLoading?: boolean;
  children: React.ReactNode | React.ReactNode[];
}
const RouteModal = ({
  backUrl = '../',
  isLoading = false,
  children,
}: RouteModalProps) => {
  const navigate = useNavigate();
  const onOpenChange = (open: boolean) => {
    if (!open) navigate(backUrl);
  };

  return (
    <Dialog defaultOpen onOpenChange={onOpenChange}>
      {isLoading ? (
        <DialogContent data-testid="dialog-container">
          <DialogHeader>
            <Skeleton className="w-3/5 h-5" />
          </DialogHeader>
          <DialogDescription className="flex flex-col gap-2">
            <Skeleton className="w-4/5 h-4" />
            <Skeleton className="w-100 h-4" />
            <Skeleton className="w-2/3 h-4" />
            <Skeleton className="w-4/5 h-4" />
            <Skeleton className="w-1/3 h-4" />
            <Skeleton className="w-4/5 h-4" />
          </DialogDescription>
          <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 flex justify-end mt-2">
            <Skeleton className="w-20 h-10" />
            <Skeleton className="w-20 h-10" />
          </DialogFooter>
        </DialogContent>
      ) : (
        children
      )}
    </Dialog>
  );
};

export default RouteModal;
