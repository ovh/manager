import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface ClipboardProps {
  text: string;
  buttonTooltip?: string;
  className?: string;
}
const Clipboard = ({ text, buttonTooltip, className }: ClipboardProps) => {
  const toast = useToast();
  const onClick = () => {
    navigator.clipboard.writeText(text);
    toast.toast({
      title: 'Copié dans le presse papier',
    });
  };
  return (
    <div
      className={cn(
        'flex items-center justify-between space-x-2 px-2 py-0 bg-gray-50 border border-gray-100 focus-visible:outline-none focus:ring-2 focus:ring-primary rounded',
        className,
      )}
      tabIndex={0}
    >
      {/* Texte tronqué si nécessaire */}
      <span className="truncate max-w-full" title={text}>
        {text}
      </span>

      {/* Bouton aligné à droite */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onClick}
              variant="ghost"
              className="p-1 hover:bg-primary-100 w-auto h-auto text-primary-600"
            >
              <Copy className="size-3 text-primary-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{buttonTooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default Clipboard;
