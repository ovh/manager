import { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';

interface VersionSelectorProps {
  versions: string[];
  selectedVersion: string;
  isFrameworkSelected: boolean;
  onChange: (version: string) => void;
}
const VersionSelector = ({
  versions,
  selectedVersion,
  isFrameworkSelected,
  onChange,
}: VersionSelectorProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="hidden">
        {versions.map((fmkVersion) => (
          <input
            type="radio"
            name="version-select"
            value={fmkVersion}
            key={fmkVersion}
            readOnly
            checked={
              isFrameworkSelected && fmkVersion === selectedVersion
            }
          />
        ))}
      </div>
      <PopoverTrigger asChild>
        <Button
          disabled={versions.length === 1}
          variant="outline"
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
          <CommandInput placeholder="Select a version" />
          <CommandList>
            <CommandEmpty>No version found.</CommandEmpty>
            <CommandGroup>
              {versions.map((fmkVersion) => (
                <CommandItem
                  key={fmkVersion}
                  value={fmkVersion}
                  onSelect={(value) => {
                    const versionFromName = versions.find(
                      (v) => v === value,
                    )!;
                    onChange(versionFromName);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-row justify-between w-full cursor-pointer overflow-hidden">
                    <span>{fmkVersion}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
export default VersionSelector;
