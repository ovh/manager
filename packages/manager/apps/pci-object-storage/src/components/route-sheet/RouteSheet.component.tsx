import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  Skeleton,
} from '@datatr-ux/uxlib';

interface RouteSheetProps {
  backUrl?: string;
  isLoading?: boolean;
  children: React.ReactNode | React.ReactNode[];
}
const RouteSheet = ({
  backUrl = '../',
  isLoading = false,
  children,
}: RouteSheetProps) => {
  const navigate = useNavigate();
  const onOpenChange = (open: boolean) => {
    if (!open) navigate(backUrl);
  };

  return (
    <Sheet defaultOpen onOpenChange={onOpenChange}>
      {isLoading ? (
        <SheetContent data-testid="dialog-container">
          <SheetHeader>
            <Skeleton className="w-3/5 h-5" />
          </SheetHeader>
          <SheetDescription className="flex flex-col gap-2">
            <Skeleton className="w-4/5 h-4" />
            <Skeleton className="w-100 h-4" />
            <Skeleton className="w-2/3 h-4" />
            <Skeleton className="w-4/5 h-4" />
            <Skeleton className="w-1/3 h-4" />
            <Skeleton className="w-4/5 h-4" />
          </SheetDescription>
          <SheetFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 flex justify-end mt-2">
            <Skeleton className="w-20 h-10" />
            <Skeleton className="w-20 h-10" />
          </SheetFooter>
        </SheetContent>
      ) : (
        children
      )}
    </Sheet>
  );
};

export default RouteSheet;
