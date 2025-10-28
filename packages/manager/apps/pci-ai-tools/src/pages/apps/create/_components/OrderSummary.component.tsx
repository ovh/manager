import {
  Cpu,
  Gpu,
  Globe,
  HardDrive,
  Hash,
  LockKeyhole,
  MemoryStick,
  MonitorCheck,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, Skeleton } from '@datatr-ux/uxlib';
import { bytesConverter } from '@/lib/bytesHelper';
import ai from '@/types/AI';
import { OrderVolumes, Scaling } from '@/types/orderFunnel';

interface OrderSummaryProps {
  order: {
    region: ai.capabilities.Region;
    flavor: ai.capabilities.Flavor;
    resourcesQuantity: number;
    image: string;
    version?: string;
    appName: string;
    unsecureHttp: boolean;
    scaling: Scaling;
    httpPort: number;
    labels: { [key: string]: string };
    volumes: OrderVolumes[];
    dockerCommand: string[];
    probe: ai.app.ProbeInput;
  };
  onSectionClicked?: (target: string) => void;
}

const buttonClassName =
  'p-0 bg-transparent hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline';

const NameDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/apps/create');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          data-testid="name-section-button"
          type="button"
          className={buttonClassName}
          onClick={() => onSectionClicked('name')}
        >
          {t('summaryFieldNameLabel')}
        </Button>
        <span>{order.appName}</span>
      </div>
    </div>
  );
};

const RegionDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/apps/create');
  const { t: tRegions } = useTranslation('regions');
  return (
    <div className="flex items-center gap-2">
      <Button
        data-testid="region-section-button"
        type="button"
        className={buttonClassName}
        onClick={() => onSectionClicked('region')}
      >
        {t('summaryFieldRegionLabel')}
      </Button>
      {order.region ? (
        <span>{tRegions(`region_${order.region.id}`)}</span>
      ) : (
        <Skeleton className="h-4 w-20" />
      )}
    </div>
  );
};

const FlavorDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/apps/create');
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Button
          data-testid="flavor-section-button"
          type="button"
          className={buttonClassName}
          onClick={() => onSectionClicked('flavor')}
        >
          {t('summaryFieldFlavorLabel')}
        </Button>
        {order.flavor ? (
          <span className="capitalize">{`${order.resourcesQuantity} ${order.flavor.id}`}</span>
        ) : (
          <Skeleton className="h-4 w-20" />
        )}
      </div>
      {order.flavor && (
        <div>
          <div className="flex items-center pl-4 gap-2">
            <Cpu className="size-4" />
            <span>
              {t('summaryFieldFlavorCores', {
                count:
                  order.resourcesQuantity * order.flavor.resourcesPerUnit.cpu,
              })}
            </span>
          </div>
          <div className="flex items-center pl-4 gap-2">
            <MemoryStick className="size-4" />
            <span>
              {t('summaryFieldFlavorMemory', {
                memory: bytesConverter(
                  order.resourcesQuantity *
                    order.flavor.resourcesPerUnit.memory,
                  false,
                  0,
                ),
              })}
            </span>
          </div>
          {order.flavor.type === ai.capabilities.FlavorTypeEnum.gpu && (
            <div className="flex items-center pl-4 gap-2">
              <Gpu className="size-4" />
              <span>
                {t('summaryFieldFlavorVMemory', {
                  memory: bytesConverter(
                    order.resourcesQuantity *
                      order.flavor.gpuInformation?.gpuMemory,
                    false,
                    0,
                  ),
                })}
              </span>
            </div>
          )}
          <div className="flex items-center pl-4 gap-2">
            <HardDrive className="size-4" />
            <span>
              {t('summaryFieldStorage', {
                disk: bytesConverter(
                  order.resourcesQuantity *
                    order.flavor.resourcesPerUnit.ephemeralStorage,
                  false,
                  0,
                ),
              })}
            </span>
          </div>
          <div className="flex items-center pl-4 gap-2">
            <Globe className="size-4" />
            <span>
              {t('summaryFieldNetwork', {
                network: bytesConverter(
                  order.resourcesQuantity *
                    order.flavor.resourcesPerUnit.publicNetwork,
                  true,
                  2,
                ),
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const ImageDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/apps/create');
  return (
    <div className="flex flex-col">
      {order.image && (
        <div className="flex items-center gap-2">
          <Button
            data-testid="image-section-button"
            type="button"
            className={buttonClassName}
            onClick={() => onSectionClicked('image')}
          >
            {t('summaryFieldImageLabel')}
          </Button>

          <>
            <span>{order.image}</span>
          </>
        </div>
      )}
      {order.version && (
        <div className="flex items-center pl-4 gap-2">
          <Hash className="size-4" />
          <span>{order.version}</span>
        </div>
      )}
    </div>
  );
};

const ScalingStrategy = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/apps/create');
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Button
          data-testid="scaling-section-button"
          type="button"
          className={buttonClassName}
          onClick={() => onSectionClicked('scaling')}
        >
          {t('summaryFieldScalingLabel')}
        </Button>
      </div>
      {order.scaling.autoScaling ? (
        <div>
          <div className="flex items-center pl-4 gap-2">
            <span>{t('scalingAutoOn')}</span>
          </div>
          <div className="flex items-center pl-4 gap-2">
            <span>
              {t('summaryMinimumReplicas', {
                rep: order.scaling.replicasMin,
              })}
            </span>
          </div>
          <div className="flex items-center pl-4 gap-2">
            <span>
              {t('summaryMaximumReplicas', {
                rep: order.scaling.replicasMax,
              })}
            </span>
          </div>
          <div className="flex items-center pl-4 gap-2">
            <span>
              {t('summaryScalingResource', {
                resource: order.scaling.resourceType,
              })}
            </span>
          </div>
          <div className="flex items-center pl-4 gap-2">
            <span>
              {t('summaryScalingAverage', {
                tresh: order.scaling.averageUsageTarget,
              })}
            </span>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center pl-4 gap-2">
            <span>{t('scalingAutoOff')}</span>
            <span></span>
          </div>
          <div className="flex items-center pl-4 gap-2">
            <span>
              {t('summaryReplicas', {
                count: order.scaling.replicas,
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const HttpPortDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/apps/create');
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Button
          data-testid="port-http-section-button"
          type="button"
          className={buttonClassName}
          onClick={() => onSectionClicked('httpPort')}
        >
          {t('summaryFieldHttpPortLabel')}
        </Button>
        <span>{order.httpPort}</span>
      </div>
    </div>
  );
};

const PrivacyDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/apps/create');
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Button
          data-testid="access-section-button"
          type="button"
          className={buttonClassName}
          onClick={() => onSectionClicked('access')}
        >
          {t('summaryFieldPrivacyLabel')}
        </Button>
        {order.unsecureHttp ? (
          <div className="flex flex-row gap-2 items-center">
            <span>{t('summaryFieldPublicLabel')}</span>
            <Globe className="size-4" />
          </div>
        ) : (
          <div className="flex flex-row gap-2 items-center">
            <span>{t('summaryFieldPrivateLabel')}</span>
            <LockKeyhole className="size-4" />
          </div>
        )}
      </div>
    </div>
  );
};

const DockerCommandDetails = ({
  order,
  onSectionClicked,
}: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/apps/create');
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Button
          data-testid="dockerCommand-section-button"
          type="button"
          className={buttonClassName}
          onClick={() => onSectionClicked('dockerCommand')}
        >
          {t('fieldDockerCommandLabel')}
        </Button>
      </div>
      <span className="ml-4">
        {t(`summaryFieldDockerCommand`, {
          count: order.dockerCommand.length,
          context: `${order.dockerCommand.length}`,
        })}
      </span>
    </div>
  );
};

const VolumesDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/apps/create');
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Button
          data-testid="volumes-section-button"
          type="button"
          className={buttonClassName}
          onClick={() => onSectionClicked('volumes')}
        >
          {t('summaryFieldVolumesLabel')}
        </Button>
        <span>
          {t(`summaryFieldVolumes`, {
            count: order.volumes.length,
            context: `${order.volumes.length}`,
          })}
        </span>
      </div>
    </div>
  );
};

const LabelsDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/apps/create');
  return (
    <div className="flex items-center gap-2">
      <Button
        data-testid="labels-section-button"
        type="button"
        className={buttonClassName}
        onClick={() => onSectionClicked('labels')}
      >
        {t('summaryFieldLabelsLabel')}
      </Button>
      <span>
        {t(`summaryFieldLabels`, {
          count: Object.keys(order.labels).length,
          context: `${Object.keys(order.labels).length}`,
        })}
      </span>
    </div>
  );
};

const ProbeDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/apps/create');
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <Button
          data-testid="probe-section-button"
          type="button"
          className={buttonClassName}
          onClick={() => onSectionClicked('probe')}
        >
          {t('fieldConfigurationProbeLabel')}
        </Button>
      </div>
      <div className="flex items-center pl-4 gap-2">
        <MonitorCheck className="size-4" />
        <span>
          {order.probe.path}:{order.probe.port}
        </span>
      </div>
    </div>
  );
};

const OrderSummary = ({ order, onSectionClicked }: OrderSummaryProps) => {
  return (
    <div className="grid grid-cols-1">
      <NameDetails order={order} onSectionClicked={onSectionClicked} />
      <RegionDetails order={order} onSectionClicked={onSectionClicked} />
      <FlavorDetails order={order} onSectionClicked={onSectionClicked} />
      <ImageDetails order={order} onSectionClicked={onSectionClicked} />
      <ScalingStrategy order={order} onSectionClicked={onSectionClicked} />
      <PrivacyDetails order={order} onSectionClicked={onSectionClicked} />
      {!order?.version && (
        <HttpPortDetails order={order} onSectionClicked={onSectionClicked} />
      )}
      {order.volumes.length > 0 && (
        <VolumesDetails order={order} onSectionClicked={onSectionClicked} />
      )}
      {Object.keys(order.labels).length > 0 && (
        <LabelsDetails order={order} onSectionClicked={onSectionClicked} />
      )}
      {order.dockerCommand.length > 0 && (
        <DockerCommandDetails
          order={order}
          onSectionClicked={onSectionClicked}
        />
      )}
      {order.probe.path && (
        <ProbeDetails order={order} onSectionClicked={onSectionClicked} />
      )}
    </div>
  );
};

export default OrderSummary;
