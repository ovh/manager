import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ArrowUpRightSquare, HelpCircleIcon } from 'lucide-react';

import { ai } from '@/models/types';
import { displaySizeFormat } from '@/data/constant';

interface ResourcesProps {
  job: ai.job.Job;
}

const ResourcesCard = ({ job }: ResourcesProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
        </CardHeader>
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          {job.spec.resources.gpu === 0 ? (
            <b>
              <p>
                {job.spec.resources.cpu} x {job.spec.resources.flavor}{' '}
              </p>
            </b>
          ) : (
            <b>
              <p>
                {job.spec.resources.gpu} x {job.spec.resources.flavor}{' '}
              </p>
            </b>
          )}
          {job.spec.resources.gpu === 0 ? (
            <p>{job.spec.resources.cpu} x INTEL CPU VCORES</p>
          ) : (
            <p>
              {job.spec.resources.gpu} x {job.spec.resources.gpuBrand}{' '}
              {job.spec.resources.gpuModel}
            </p>
          )}
          {job.spec.resources.gpu !== 0 && (
            <p>
              {job.spec.resources.gpu} x{' '}
              {displaySizeFormat(job.spec.resources.gpuMemory, false, 0)}{' '}
              RAM
            </p>
          )}
        </CardContent>
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          <p>
            <b>Other resources</b>
          </p>
          {job.spec.resources.gpu !== 0 && (
            <p>CPU : {job.spec.resources.cpu} vCores</p>
          )}
          <p>
            RAM : {displaySizeFormat(job.spec.resources.memory, false, 0)}
          </p>
          <p>
            Public network:{' '}
            {displaySizeFormat(job.spec.resources.publicNetwork, true, 2)}
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
                job.spec.resources.ephemeralStorage,
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
        </CardContent>
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          <p className='mb-2'>
            <b>Usage monitoring</b>
          </p>
          <Button
            variant="outline"
          >
            <div className="flex justify-between items-center">
              <Link to={job.status.monitoringUrl || ''}>
                Go to graph Dashboard
              </Link>
              <ArrowUpRightSquare className="w-4 h-4 ml-2" />
            </div>
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default ResourcesCard;
