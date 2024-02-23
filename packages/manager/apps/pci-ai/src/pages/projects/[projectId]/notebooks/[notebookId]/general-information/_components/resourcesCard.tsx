import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ArrowRight, HelpCircleIcon } from 'lucide-react';

import { ai } from '@/models/types';
import { displaySizeFormat } from '@/data/constant';
import ResourceSlider from './resourceSlider';

interface ResourcesProps {
  notebook: ai.notebook.Notebook;
}

const ResourcesCard = ({ notebook }: ResourcesProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
        </CardHeader>
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          {notebook.spec.resources.gpu === 0 ? (
            <b>
              <p>
                {notebook.spec.resources.cpu} x {notebook.spec.resources.flavor}{' '}
              </p>
            </b>
          ) : (
            <b>
              <p>
                {notebook.spec.resources.gpu} x {notebook.spec.resources.flavor}{' '}
              </p>
            </b>
          )}
          {notebook.spec.resources.gpu === 0 ? (
            <p>{notebook.spec.resources.cpu} x INTEL CPU VCORES</p>
          ) : (
            <p>
              {notebook.spec.resources.gpu} x {notebook.spec.resources.gpuBrand}{' '}
              {notebook.spec.resources.gpuModel}
            </p>
          )}
          {notebook.spec.resources.gpu !== 0 && (
            <p>
              {notebook.spec.resources.gpu} x{' '}
              {displaySizeFormat(notebook.spec.resources.gpuMemory, false, 0)}{' '}
              RAM
            </p>
          )}
        </CardContent>
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          <p>
            <b>Other resources</b>
          </p>
          {notebook.spec.resources.gpu !== 0 && (
            <p>CPU : {notebook.spec.resources.cpu} vCores</p>
          )}
          <p>
            RAM : {displaySizeFormat(notebook.spec.resources.memory, false, 0)}
          </p>
          <p>
            Public network:{' '}
            {displaySizeFormat(notebook.spec.resources.publicNetwork, true, 2)}
            /s
          </p>
        </CardContent>
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          <p>
            <b>Storage</b>
          </p>
          <div className="flex justify-between items-center">
            <p>
              Temporary local storage :{' '}
              {displaySizeFormat(
                notebook.spec.resources.ephemeralStorage,
                false,
                0,
              )}{' '}
              SSD
            </p>
            <div className="relative inline-block">
              <Popover>
                <PopoverTrigger>
                  <HelpCircleIcon className="w-4 h-4" />
                </PopoverTrigger>
                <PopoverContent className="absolute right-3 top-1/2 transform -translate-y-3/4 w-64 text-sm text-muted-foreground">
                  <p>High-performance local storage, but not backed up</p>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p>Workspace : 10 GiB SSD included</p>
            <div className="relative inline-block">
              <Popover>
                <PopoverTrigger>
                  <HelpCircleIcon className="w-4 h-4" />
                </PopoverTrigger>
                <PopoverContent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-80 text-sm text-muted-foreground">
                  <p>
                    Remote storage backed up. After 30 consecutive days of
                    storage or/and exceeding this quota of 10 GiB, the prices
                    applied will be those for Public Cloud Object Storage
                  </p>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            {notebook.status.workspace && (
              <ResourceSlider
                storageFree={notebook.status.workspace.storageFree}
                storageUsed={notebook.status.workspace?.storageUsed}
              />
            )}
          </div>
        </CardContent>
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          <p>
            <b>Real-time monitoring</b>
          </p>
          <Button
            variant="linkBis"
            size="sm"
            asChild
          >
            <Link to={notebook.status.monitoringUrl || ''}>
              Access Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default ResourcesCard;
