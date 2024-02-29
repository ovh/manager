import { ovhUrl } from '@/components/ovhNavigation';
import { H3, H4 } from '@/components/typography';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ai } from '@/models/types';
import { AlertTriangle, Check, ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';


interface SharedRegistryProps {
  projectId: string;
  regionsList: ai.capabilities.Region[];
}

const SharedRegistry = ({ projectId, regionsList }: SharedRegistryProps) => {
  
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState(regionsList[0]);
  return (
    <>
      <H3>Shared Docker Registries</H3>
      <Alert className="my-3 text-base py-2 font-normal" variant="warning">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6" />
          <p>
            By default, we store private images of your jobs on a Docker
            Registry managed by OVHcloud, and shared with our customers. The
            images stored on it can be deleted at any time. We recommend using
            your private registry to store your own images.
          </p>
        </div>
      </Alert>
      <div className="flex gap-3">
        <p>Select the region you want to use:</p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="combobox"
              size="combobox"
              role="combobox"
              className="w-[100px] justify-between"
            >
              {region
                ? regionsList.find((reg) => reg.id === region.id)?.id
                : 'Select your region'}
              <ChevronDown className="text-primary ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Search region" />
              <CommandGroup>
                {regionsList.map((reg) => (
                  <CommandItem
                    value={reg.id}
                    key={reg.id}
                    onSelect={(currentValue) => {
                      setRegion(
                        regionsList.find(
                          (reg) => reg.id === currentValue.toUpperCase(),
                        ) || regionsList[0],
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        region === reg ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {reg.id}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="my-2">
        <div className="flex gap-2">
          <H4>Docker Registry</H4>
          <HelpCircle className="w-4 h-4" />
        </div>
        <p>{region.registryUrl}</p>
      </div>
      <div className="my-2">
        <H4>Public Cloud project</H4>
        <p>{projectId}</p>
      </div>
      <p className="my-2">
        You can connect to the shared Docker Registry via the following command:
      </p>
      <div className="rounded border border-gray-200 bg-muted w-1/2 px-2 py-3 font-mono text-sm font-semibold">
        <code>
          docker login {region.registryUrl}/{projectId}
        </code>
      </div>
      <div className="my-2">
        <div className="flex gap-1">
          <p>You can authenticate on the platform via all</p>
          <a className="text-primary font-semibold" href={ovhUrl('public-cloud',`#/pci/project/${projectId}/users`,{})}>configured users</a>
          <p>within the same Public Cloud project.</p>
        </div>

        <p>You can then mark your images and upload them to the registry.</p>
      </div>
      <div className="flex flex-col my-2 rounded border border-gray-200 bg-muted w-1/2 px-2 py-3 font-mono text-sm font-semibold">
        <code>
          docker tag &lt;image&gt;{region.registryUrl}/{projectId}/&lt;image&gt;
        </code>
        <code>
          docker push {region.registryUrl}/{projectId}/&lt;image&gt;
        </code>
      </div>
      <div className="my-2">
        <p>Your image can now be used in a job or app.</p>
      </div>
    </>
  );
};

export default SharedRegistry;
