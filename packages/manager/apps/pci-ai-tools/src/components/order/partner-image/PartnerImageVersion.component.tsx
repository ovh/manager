import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@datatr-ux/uxlib';
import { cn } from '@/lib/utils';

interface ImageVersionSelectorProps {
  versions: string[];
  selectedVersion: string;
  isImageSelected: boolean;
  onChange: (version: string) => void;
}
const ImageVersionSelector = ({
  versions,
  selectedVersion,
  isImageSelected,
  onChange,
}: ImageVersionSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('ai-tools/components/partner-image');
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div data-testid="image-version-container" className="hidden">
        {versions.map((imgVersion) => (
          <input
            type="radio"
            name="version-select"
            value={imgVersion}
            key={imgVersion}
            readOnly
            checked={isImageSelected && imgVersion === selectedVersion}
          />
        ))}
      </div>
      <PopoverTrigger asChild>
        <Button
          data-testid="popover-trigger-button"
          disabled={versions.length === 1}
          mode="outline"
          size="sm"
          className="rounded-none justify-start w-full border border-[#bef1ff] font-normal text-[#4d5592] "
        >
          {selectedVersion && (
            <div className="flex flex-row w-full justify-between overflow-hidden">
              {selectedVersion}
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="bottom" align="end">
        <Command>
          <CommandInput placeholder={t('selectAVersion')} />
          <CommandList>
            <CommandEmpty>{t('noVersionFound')}</CommandEmpty>
            <CommandGroup>
              {versions.map((imgVersion) => (
                <CommandItem
                  key={imgVersion}
                  value={imgVersion}
                  onSelect={(value) => {
                    onChange(value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      imgVersion === selectedVersion
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  <span className="w-full cursor-pointer overflow-hidden">
                    {imgVersion}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ImageVersionSelector;
