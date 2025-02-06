import { Cpu, Globe, HardDrive, LockKeyhole, MemoryStick } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { bytesConverter } from '@/lib/bytesHelper';
import * as ai from '@/types/cloud/project/ai';
import { OrderVolumes } from '@/types/orderFunnel';

interface OrderSummaryProps {
  order: {
    region: ai.capabilities.Region;
    flavor: ai.capabilities.Flavor;
    resourcesQuantity: number;
    image: string;
    jobName: string;
    unsecureHttp: boolean;
    // labels: { [key: string]: string };
    sshKey: string[];
    volumes: OrderVolumes[];
    dockerCommand: string[];
  };
  onSectionClicked?: (target: string) => void;
}
const NameDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('pci-ai-training/jobs/create');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          data-testid="name-section-button"
          variant={'link'}
          size={'link'}
          type="button"
          onClick={() => onSectionClicked('name')}
          className="font-bold"
        >
          {t('summaryFieldNameLabel')}
        </Button>
        <span>{order.jobName}</span>
      </div>
    </div>
  );
};

const RegionDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('pci-ai-training/jobs/create');
  const { t: tRegions } = useTranslation('regions');
  return (
    <div className="flex items-center gap-2">
      <Button
        data-testid="region-section-button"
        variant={'link'}
        size={'link'}
        type="button"
        onClick={() => onSectionClicked('region')}
        className="font-bold"
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
  const { t } = useTranslation('pci-ai-training/jobs/create');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          data-testid="flavor-section-button"
          variant={'link'}
          size={'link'}
          type="button"
          onClick={() => onSectionClicked('flavor')}
          className="font-bold"
        >
          {t('summaryFieldFlavorLabel')}
        </Button>
        {order.flavor ? (
          <span className="capitalize">{`${order.resourcesQuantity} ${order.flavor.id}`}</span>
        ) : (
          <Skeleton className="h-4 w-20" />
        )}
      </div>
      {order.flavor && order.resourcesQuantity && (
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
  const { t } = useTranslation('pci-ai-training/jobs/create');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          data-testid="image-section-button"
          variant={'link'}
          size={'link'}
          type="button"
          onClick={() => onSectionClicked('image')}
          className="font-bold"
        >
          {t('summaryFieldEditorLabel')}
        </Button>
        {order.image && (
          <>
            <span>{order.image}</span>
          </>
        )}
      </div>
    </div>
  );
};

const PrivacyDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('pci-ai-training/jobs/create');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          data-testid="access-section-button"
          variant={'link'}
          size={'link'}
          type="button"
          onClick={() => onSectionClicked('access')}
          className="font-bold"
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
  const { t } = useTranslation('pci-ai-training/jobs/create');
  return (
    <div className="flex items-center gap-2">
      <Button
        data-testid="dockerCommand-section-button"
        variant={'link'}
        size={'link'}
        type="button"
        onClick={() => onSectionClicked('dockerCommand')}
        className="font-bold"
      >
        {t('summaryDockerCommandLabel')}
      </Button>
      <span>
        {t(`summaryFieldDockerCommand`, {
          count: order.dockerCommand.length,
          context: `${order.dockerCommand.length}`,
        })}
      </span>
    </div>
  );
};

const VolumesDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('pci-ai-training/jobs/create');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          data-testid="volumes-section-button"
          variant={'link'}
          size={'link'}
          type="button"
          onClick={() => onSectionClicked('volumes')}
          className="font-bold"
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

// const LabelsDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
//   const { t } = useTranslation('pci-ai-training/jobs/create');
//   return (
//     <div className="flex items-center gap-2">
//       <Button
//         data-testid="labels-section-button"
//         variant={'link'}
//         size={'link'}
//         type="button"
//         onClick={() => onSectionClicked('labels')}
//         className="font-bold"
//       >
//         {t('summaryFieldLabelsLabel')}
//       </Button>
//       <span>
//         {t(`summaryFieldLabels`, {
//           count: Object.keys(order.labels).length,
//           context: `${Object.keys(order.labels).length}`,
//         })}
//       </span>
//     </div>
//   );
// };

const SshKeysDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('pci-ai-training/jobs/create');
  return (
    <div className="flex items-center gap-2">
      <Button
        data-testid="sshKeys-section-button"
        variant={'link'}
        size={'link'}
        type="button"
        onClick={() => onSectionClicked('sshKey')}
        className="font-bold"
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
    <div className="grid grid-cols-1 gap-2">
      <NameDetails order={order} onSectionClicked={onSectionClicked} />
      <RegionDetails order={order} onSectionClicked={onSectionClicked} />
      <FlavorDetails order={order} onSectionClicked={onSectionClicked} />
      <ImageDetails order={order} onSectionClicked={onSectionClicked} />
      <PrivacyDetails order={order} onSectionClicked={onSectionClicked} />
      {order.volumes.length > 0 && (
        <VolumesDetails order={order} onSectionClicked={onSectionClicked} />
      )}
      {/* {Object.keys(order.labels).length > 0 && (
        <LabelsDetails order={order} onSectionClicked={onSectionClicked} />
      )} */}
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
