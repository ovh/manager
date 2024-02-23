import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { H2, H3 } from '@/components/typography';
import { Check, ChevronDown } from 'lucide-react';

import { DashboardLayoutContext } from '../_layout';
import { ai } from '@/models/types';

export default function DashboardRegistriesPage() {
  const { regionsQuery } = useOutletContext() as DashboardLayoutContext;
  const regionsList: ai.capabilities.Region[] = regionsQuery.data || [];
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState(regionsList[0]);

  return (
    <>
      <H2>Command Line Interface (CLI)</H2>

      <p>
        Use our ovhai interface to access and manage your notebooks, jobs and
        applications in command lines (CLI).
      </p>
      <H3>Installation</H3>
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
                    <Check className={cn(
                        'mr-2 h-4 w-4', 
                        region === reg ? 'opacity-100' : 'opacity-0',
                    )} />
                    {reg.id}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
