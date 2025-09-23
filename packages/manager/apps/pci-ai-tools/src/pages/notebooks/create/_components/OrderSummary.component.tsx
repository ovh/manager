import { Button, Skeleton } from '@datatr-ux/uxlib';
import {
  Cpu,
  Gpu,
  Globe,
  HardDrive,
  Hash,
  LockKeyhole,
  MemoryStick,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { bytesConverter } from '@/lib/bytesHelper';
import { OrderVolumes } from '@/types/orderFunnel';
import { humanizeFramework } from '@/lib/orderFunnelHelper';
import ai from '@/types/AI';

interface OrderSummaryProps {
  order: {
    region: ai.capabilities.Region;
    flavor: ai.capabilities.Flavor;
    resourcesQuantity: number;
    framework: ai.capabilities.notebook.Framework;
    version: string;
    editor: ai.capabilities.notebook.Editor;
    notebookName: string;
    unsecureHttp: boolean;
    labels: { [key: string]: string };
    sshKey: string[];
    volumes: OrderVolumes[];
  };
  onSectionClicked?: (target: string) => void;
}
const buttonClassName =
  'p-0 bg-transparent hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline';

const NameDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/notebooks/create');
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Button
          data-testid="name-section-button"
          type="button"
          className={buttonClassName}
          onClick={() => onSectionClicked('name')}
        >
          {t('summaryFieldNameLabel')}
        </Button>
        <span>{order.notebookName}</span>
      </div>
    </div>
  );
};

const RegionDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/notebooks/create');
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
  const { t } = useTranslation('ai-tools/notebooks/create');
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

const FrameworkDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/notebooks/create');
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Button
          data-testid="framework-section-button"
          type="button"
          onClick={() => onSectionClicked('framework')}
          className={buttonClassName}
        >
          {t('summaryFieldFrameworkLabel')}
        </Button>
        {order.framework && (
          <>
            <span>{humanizeFramework(order.framework)}</span>
          </>
        )}
      </div>
      <div className="flex items-center pl-4 gap-2">
        <Hash className="size-4" />
        {order.version ? (
          <span>{order.version}</span>
        ) : (
          <Skeleton className="h-4 w-16" />
        )}
      </div>
    </div>
  );
};

const EditorDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/notebooks/create');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          data-testid="editor-section-button"
          type="button"
          onClick={() => onSectionClicked('editor')}
          className={buttonClassName}
        >
          {t('summaryFieldEditorLabel')}
        </Button>
        {order.editor && (
          <>
            <span>{order.editor.name}</span>
            {order.editor.logoUrl && (
              <img
                className="block w-6 h-6"
                src={order.editor.logoUrl}
                alt={order.editor.name}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

const PrivacyDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/notebooks/create');
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

const VolumesDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/notebooks/create');
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

const LabelsDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/notebooks/create');
  return (
    <div className="flex items-center gap-2">
      <Button
        data-testid="labels-section-button"
        type="button"
        onClick={() => onSectionClicked('labels')}
        className={buttonClassName}
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

const SshKeysDetails = ({ order, onSectionClicked }: OrderSummaryProps) => {
  const { t } = useTranslation('ai-tools/notebooks/create');
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
      <FrameworkDetails order={order} onSectionClicked={onSectionClicked} />
      <EditorDetails order={order} onSectionClicked={onSectionClicked} />
      <PrivacyDetails order={order} onSectionClicked={onSectionClicked} />
      {order.volumes.length > 0 && (
        <VolumesDetails order={order} onSectionClicked={onSectionClicked} />
      )}
      {Object.keys(order.labels).length > 0 && (
        <LabelsDetails order={order} onSectionClicked={onSectionClicked} />
      )}
      {order.sshKey.length > 0 && (
        <SshKeysDetails order={order} onSectionClicked={onSectionClicked} />
      )}
    </div>
  );
};

export default OrderSummary;
