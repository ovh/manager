import {
  Cpu,
  Gpu,
  Globe,
  HardDrive,
  LockKeyhole,
  MemoryStick,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, Skeleton } from '@datatr-ux/uxlib';
import { bytesConverter } from '@/lib/bytesHelper';
import { OrderVolumes } from '@/types/orderFunnel';
import ai from '@/types/AI';

interface OrderSummaryProps {
  order: {
    region: ai.capabilities.Region;
    flavor: ai.capabilities.Flavor;
    resourcesQuantity: number;
    image: string;
    jobName: string;
    unsecureHttp: boolean;
    sshKey: string[];
    volumes: OrderVolumes[];
    dockerCommand: string[];
  };
  onSectionClicked?: (target: string) => void;
}
const buttonClassName =
  'p-0 bg-transparent hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline';

const NameDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/jobs/create');
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
        <span>{order.jobName}</span>
      </div>
    </div>
  );
};

const RegionDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/jobs/create');
  const { t: tRegions } = useTranslation('regions');
  return (
    <div className="flex items-center gap-2">
      <Button
        data-testid="region-section-button"
        type="button"
        onClick={() => onSectionClicked('region')}
        className={buttonClassName}
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
  const { t } = useTranslation('ai-tools/jobs/create');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          data-testid="flavor-section-button"
          type="button"
          onClick={() => onSectionClicked('flavor')}
          className={buttonClassName}
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
  const { t } = useTranslation('ai-tools/jobs/create');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          data-testid="image-section-button"
          type="button"
          onClick={() => onSectionClicked('image')}
          className={buttonClassName}
        >
          {t('summaryFieldEditorLabel')}
        </Button>
        {order.image && <span>{order.image}</span>}
      </div>
    </div>
  );
};

const PrivacyDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/jobs/create');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          data-testid="access-section-button"
          type="button"
          onClick={() => onSectionClicked('access')}
          className={buttonClassName}
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
  const { t } = useTranslation('ai-tools/jobs/create');
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Button
          data-testid="dockerCommand-section-button"
          type="button"
          onClick={() => onSectionClicked('dockerCommand')}
          className={buttonClassName}
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
  const { t } = useTranslation('ai-tools/jobs/create');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          data-testid="volumes-section-button"
          type="button"
          onClick={() => onSectionClicked('volumes')}
          className={buttonClassName}
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

const SshKeysDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/jobs/create');
  return (
    <div className="flex items-center gap-2">
      <Button
        data-testid="sshKeys-section-button"
        type="button"
        onClick={() => onSectionClicked('sshKey')}
        className={buttonClassName}
      >
        {t('summaryFieldSSHLabel')}
      </Button>
      <span>
        {t(`summaryFieldSshKey`, {
          count: order.sshKey.length,
          context: `${order.sshKey.length}`,
        })}
      </span>
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
      <PrivacyDetails order={order} onSectionClicked={onSectionClicked} />
      {order.volumes.length > 0 && (
        <VolumesDetails order={order} onSectionClicked={onSectionClicked} />
      )}
      {order.sshKey.length > 0 && (
        <SshKeysDetails order={order} onSectionClicked={onSectionClicked} />
      )}
      {order.dockerCommand.length > 0 && (
        <DockerCommandDetails
          order={order}
          onSectionClicked={onSectionClicked}
        />
      )}
    </div>
  );
};

export default OrderSummary;
