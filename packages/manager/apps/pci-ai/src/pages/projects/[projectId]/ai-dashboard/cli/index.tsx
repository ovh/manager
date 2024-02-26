import { toast } from 'sonner';
import { Link, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { H2, H3 } from '@/components/typography';
import { Alert } from '@/components/ui/alert';
import { ArrowRight, Check, ChevronDown, Files, Info } from 'lucide-react';

import { DashboardLayoutContext } from '../_layout';
import { ai } from '@/models/types';

export default function DashboardRegistriesPage() {
  const { regionsQuery } = useOutletContext() as DashboardLayoutContext;
  const regionsList: ai.capabilities.Region[] = regionsQuery.data || [];
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState(regionsList[0]);

  useEffect(() => {
    if (regionsQuery.data) {
      setRegion(regionsQuery?.data[0]);
    }
  }, [regionsQuery.data]);

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
      {region && (
        <div className="flex flex-row justify-between items-center my-2 rounded border border-gray-200 bg-muted w-2/3 px-2 py-4 font-mono text-sm font-semibold">
          <code>curl -s {region.cliInstallUrl} | bash</code>
          <Files
            className="w-4 h-4 ml-3 mb-1 hover:text-primary"
            onClick={() => {
              navigator.clipboard.writeText(
                'curl -s ' + region.cliInstallUrl + ' | bash',
              );
              toast.success('Command saved in clipboard', {
                dismissible: true,
              });
            }}
          />
        </div>
      )}
      <Alert variant="default" className="w-2/3 py-4">
        <div className="flex items-center gap-3">
          <Info className="w-6 h-6" />
          <p>Be sure to restart your machine so that you can use ovhai.</p>
        </div>
      </Alert>
      <H3>Authentication</H3>
      <p>
        Authentication on the platform can be done via any users and AI tokens
        configured within the same Public Cloud project.
      </p>
      <Button
        className="mb-2"
        disabled={true}
        variant="linkBis"
        size="sm"
        asChild
      >
        <Link to={'./../users-tokens'}>
          Manage my users and tokens
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </Button>
      <p className="mb-2">The authentication steps are as follows:</p>
      <div className="ml-12">
        <ul className="list-disc">
          <li>
            <div className="flex gap-1">
              <span>launch</span>
              <code className="rounded border px-1 border-rose-100 bg-rose-100 font-mono text-sm text-red-600">
                ovhai login
              </code>
            </div>
          </li>
          <li>select authentication type in terminal or via browser</li>
          <li>enter the user’s login details or their associated token</li>
          <li>this process is now complete</li>
        </ul>
      </div>
      <H3>Commands</H3>
      <div className="flex gap-1">
        <span>Launch</span>
        <code className="rounded border px-1 border-rose-100 bg-rose-100 font-mono text-sm text-red-600">
          ovhai --help
        </code>
        <span>to get a list of available actions.</span>
      </div>
    </>
  );
}
