import { Button } from '@datatr-ux/uxlib';
import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export default function RefreshButton({
  onClick,
  isLoading,
}: RefreshButtonProps) {
  return (
    <Button
      mode="outline"
      className="h-10 px-4"
      onClick={onClick}
      disabled={isLoading}
    >
      <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
    </Button>
  );
}
