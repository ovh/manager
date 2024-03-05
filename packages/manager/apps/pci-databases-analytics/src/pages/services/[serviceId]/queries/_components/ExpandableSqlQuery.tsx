import * as React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface ExpandableSqlQueryProps {
  sqlQuery: string;
  previewLength?: number; // Optional: Number of characters to show in preview
}

export const ExpandableSqlQuery: React.FC<ExpandableSqlQueryProps> = ({
  sqlQuery,
  previewLength = 30, // Default preview length of 50 characters
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isCollapsible = sqlQuery.length > previewLength;

  // Helper function to get the preview text
  const getPreviewText = (text: string, length: number) => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  const TriggerIcon = isOpen ? ChevronDown : ChevronRight;

  return (
    <div className="w-full">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="rounded-md overflow-hidden"
      >
        <div className="flex items-start p-2">
          {isCollapsible && (
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="mr-2 h-auto p-0 flex items-center justify-center"
              >
                <TriggerIcon className="size-5" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          )}
          <div className="flex-1">
            {!isOpen && (
              <div className="font-mono text-sm whitespace-nowrap">
                {getPreviewText(sqlQuery, previewLength)}
              </div>
            )}
            {isOpen && (
              <CollapsibleContent className="font-mono text-sm whitespace-pre-line">
                {sqlQuery}
              </CollapsibleContent>
            )}
          </div>
        </div>
      </Collapsible>
    </div>
  );
};
