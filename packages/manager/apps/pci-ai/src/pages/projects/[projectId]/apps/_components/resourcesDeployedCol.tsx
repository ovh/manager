import { ai } from '@/models/types';
import { BatteryCharging, Cpu } from 'lucide-react';

const ResourcesDeployedColumn = ({ app }: { app: ai.app.App }) => {
  let resourceDep: string = '';
  let isGpu: boolean = false;
  if (app.spec.resources.gpu > 0) {
    isGpu = true;
    if (app.spec.scalingStrategy?.fixed) {
      resourceDep =
        app.spec.resources.gpu +
        ' GPU / ' +
        app.spec.scalingStrategy?.fixed?.replicas +
        ' replicas';
    } else {
      resourceDep =
        app.spec.resources.gpu +
        ' GPU / ' +
        app.spec.scalingStrategy?.automatic?.replicasMax +
        ' replicas';
    }
  } else {
    if (app.spec.scalingStrategy?.fixed) {
      resourceDep =
        app.spec.resources.cpu +
        ' CPU / ' +
        app.spec.scalingStrategy?.fixed?.replicas +
        ' replicas';
    } else {
      resourceDep =
        app.spec.resources.cpu +
        ' CPU / ' +
        app.spec.scalingStrategy?.automatic?.replicasMax +
        ' replicas';
    }
  }
  return (
    <div>
      {isGpu ? (
        <div className="flex flew-row">
          <BatteryCharging className="w-5 h-5 mr-1" />
          <p>{resourceDep}</p>
        </div>
      ) : (
        <div className="flex flew-row">
          <Cpu className="w-5 h-5 mr-1" />
          <p>{resourceDep}</p>
        </div>
      )}
    </div>
  );
};

export default ResourcesDeployedColumn;
