import { Link } from 'react-router-dom';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Pencil } from 'lucide-react';

import { ai } from '@/models/types';
import { displaySizeFormat } from '@/data/constant';
import UpdateScalingModal from './updatedScalingModal';


interface ResourcesProps {
  app: ai.app.App;
}

const ResourcesCard = ({ app }: ResourcesProps) => {
  const [isUpdateScalingModalOpen, setIsUpdateScalingModalOpen] = useState(false);

  const onUpdateScalingSubmit = () => {
    setIsUpdateScalingModalOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
        </CardHeader>
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          <b>
            <p>Scaling</p>
          </b>
          <div className="flex flex-row gap-4">
            <div className="basis-3/4">
              {app.spec.scalingStrategy?.fixed ? (
                <div>
                  <p>Fixed scaling</p>
                  <div className="pl-4">
                    <ul className="ml-4 list-disc">
                      <li>
                        Replicas: {app.spec.scalingStrategy.fixed.replicas}
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div>
                  <p>Auto-scaling</p>
                  <div className="pl-4">
                    <ul className="ml-4 list-disc">
                      <li>
                        Minimum number of replicas:{' '}
                        {app.spec.scalingStrategy?.automatic?.replicasMin}
                      </li>
                      <li>
                        Maximum number of replicas:{' '}
                        {app.spec.scalingStrategy?.automatic?.replicasMax}
                      </li>
                      <li>
                        Metric monitored:{' '}
                        {app.spec.scalingStrategy?.automatic?.resourceType}
                      </li>
                      <li>
                        Trigger threshold:{' '}
                        {
                          app.spec.scalingStrategy?.automatic
                            ?.averageUsageTarget
                        }
                        %
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="basis-1/4">
              <div className="flex justify-end">
                <Button
                  onClick={() => setIsUpdateScalingModalOpen(true)}
                  className="text-primary bg-white font-semibold hover:bg-primary-100 hover:text-primary"
                  variant="ghost"
                >
                  <Pencil className="w-4 h-4 mb-1" />{isUpdateScalingModalOpen}
                </Button>
                <UpdateScalingModal
                  app={app}
                  open={isUpdateScalingModalOpen}
                  onClose={() => setIsUpdateScalingModalOpen(false)}
                  onSubmit={onUpdateScalingSubmit}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          {app.spec.resources.gpu === 0 ? (
            <b>
              <p>
                {app.spec.resources.cpu} x {app.spec.resources.flavor}{' '}
              </p>
            </b>
          ) : (
            <b>
              <p>
                {app.spec.resources.gpu} x {app.spec.resources.flavor}{' '}
              </p>
            </b>
          )}
          {app.spec.resources.gpu === 0 ? (
            <p>{app.spec.resources.cpu} x INTEL CPU VCORES</p>
          ) : (
            <p>
              {app.spec.resources.gpu} x {app.spec.resources.gpuBrand}{' '}
              {app.spec.resources.gpuModel}
            </p>
          )}
          {app.spec.resources.gpu !== 0 && (
            <p>
              {app.spec.resources.gpu} x{' '}
              {displaySizeFormat(app.spec.resources.gpuMemory, false, 0)} RAM
            </p>
          )}
        </CardContent>
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          <p>
            <b>Other resources</b>
          </p>
          {app.spec.resources.gpu !== 0 && (
            <p>CPU : {app.spec.resources.cpu} vCores</p>
          )}
          <p>RAM : {displaySizeFormat(app.spec.resources.memory, false, 0)}</p>
          <p>
            Public network:{' '}
            {displaySizeFormat(app.spec.resources.publicNetwork, true, 2)}
            /s
          </p>
        </CardContent>
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          <b>
            <p>Local Storage per resource</p>
          </b>
          <p>
            {displaySizeFormat(app.spec.resources.ephemeralStorage, true, 0)}
          </p>
        </CardContent>
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          <p>
            <b>Real-time app monitoring</b>
          </p>
          <Button
            variant="link"
            size="sm"
            className="font-semibold hover:bg-primary-100 hover:text-primary"
            asChild
          >
            <Link to={app.status.monitoringUrl || ''}>
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
