import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Engine, Version } from '@/models/dto/OrderFunnel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const EngineTile = ({
  engine,
  version,
  selected,
  onChange,
}: {
  engine: Engine;
  version: Version;
  selected: boolean;
  onChange: (engine: Engine, version: Version) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<Version>(version);
  const handleEngineClick = () => {
    onChange(engine, selectedVersion);
  };
  useEffect(() => {
    onChange(engine, selectedVersion);
  }, [selectedVersion]);

  return (
    <div
      tabIndex={0}
      role="button"
      className={`border-2 rounded-md p-4 hover:shadow-sm hover:border-[#0050d7] hover:bg-[#bef1ff] ${
        selected ? 'border-[#0050d7] bg-[#def8ff]' : ' border-[#bef1ff]'
      }`}
      onClick={() => handleEngineClick()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleEngineClick();
      }}
    >
      <h3 className="text-[#4d5592]">{engine.name}</h3>
      <p className="text-sm text-[#4d5592] ">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod libero sit
        possimus.
      </p>
      <div
        className={`border-[#85d9fd] border-t mt-2 pt-2 ${
          selected ? 'border-[#85d9fd]' : 'border-[#bef1ff]'
        }`}
      ></div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={engine.versions.length === 1}
            variant="outline"
            size="sm"
            className="rounded-none justify-start w-full border border-[#bef1ff] font-normal text-[#4d5592] "
          >
            {selectedVersion ? (
              <div className="flex flex-row w-full justify-between overflow-hidden">
                {selectedVersion.name}
                {/* <div className="ml-2 flex gap-1">
                  {selectedVersion.tags.map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div> */}
              </div>
            ) : (
              <></>
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
                {engine.versions.map((engineVersion) => (
                  <CommandItem
                    key={engineVersion.name}
                    value={engineVersion.name}
                    onSelect={(value) => {
                      const versionFromName = engine.versions.find(
                        (v) => v.name === value,
                      )!;
                      setSelectedVersion(() => versionFromName);
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
    </div>
  );
};

export default EngineTile;
