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
import { Badge } from '@/components/ui/badge';
import { Version } from '@/models/order-funnel';

interface VersionSelectorProps {
  versions: Version[];
  selectedVersion: Version;
  isEngineSelected: boolean;
  onChange: (version: Version) => void;
}
const VersionSelector = ({
  versions,
  selectedVersion,
  isEngineSelected,
  onChange,
}: VersionSelectorProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="hidden">
        {versions
          .sort((a, b) => a.order - b.order)
          .map((engineVersion) => (
            <input
              type="radio"
              name="version-select"
              value={engineVersion.name}
              key={engineVersion.name}
              readOnly
              checked={
                isEngineSelected && engineVersion.name === selectedVersion.name
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
              {selectedVersion.name}
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
              {versions.map((engineVersion) => (
                <CommandItem
                  key={engineVersion.name}
                  value={engineVersion.name}
                  onSelect={(value) => {
                    const versionFromName = versions.find(
                      (v) => v.name === value,
                    );
                    onChange(versionFromName);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-row justify-between w-full cursor-pointer overflow-hidden">
                    <span>{engineVersion.name}</span>
                    <div className="ml-2 flex gap-1">
                      {engineVersion.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
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
