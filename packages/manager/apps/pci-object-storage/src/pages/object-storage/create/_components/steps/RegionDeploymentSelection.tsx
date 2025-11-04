import { CheckboxIndicator, CheckboxTile } from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import cloud from '@/types/Cloud';
import { cn } from '@/lib/utils';
import { RegionTypeBadge } from '@/components/region-type-badge/RegionTypeBadge.component';

type TDeploymentMode = {
  mode: cloud.RegionTypeEnum;
  title: string;
  description: string;
  Image: () => JSX.Element;
  isDefaultActive?: boolean;
};

type TDeploymentModeConfig = {
  mode: cloud.RegionTypeEnum;
  imagePath: string;
  isDefaultActive: boolean;
};

export type TDeploymentModeSelectionProps = {
  value: cloud.RegionTypeEnum[];
  onChange: (modes: cloud.RegionTypeEnum[]) => void;
};

const DEPLOYMENT_MODES_CONFIG: TDeploymentModeConfig[] = [
  {
    mode: cloud.RegionTypeEnum['region-3-az'],
    imagePath: 'assets/deploymentRegion/3AZ.svg',
    isDefaultActive: true,
  },
  {
    mode: cloud.RegionTypeEnum.region,
    imagePath: 'assets/deploymentRegion/1AZ.svg',
    isDefaultActive: true,
  },
  {
    mode: cloud.RegionTypeEnum.localzone,
    imagePath: 'assets/deploymentRegion/LZ.svg',
    isDefaultActive: false,
  },
];

export const getDefaultDeploymentModes = (): cloud.RegionTypeEnum[] => {
  return DEPLOYMENT_MODES_CONFIG.filter((config) => config.isDefaultActive).map(
    (config) => config.mode,
  );
};

const Icon = ({
  imagePath,
  width = 288,
  height = 170,
}: {
  imagePath: string;
  width?: number;
  height?: number;
}) => (
  <div
    style={{
      backgroundImage: `url('${imagePath}')`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      width: `${width}px`,
      height: `${height}px`,
    }}
    className={cn('inline-block align-middle shadow-sm')}
  />
);

export const DeploymentModeSelection = ({
  value,
  onChange,
}: TDeploymentModeSelectionProps) => {
  const { t } = useTranslation('pci-object-storage/order-funnel');

  const getTranslationKey = (
    mode: cloud.RegionTypeEnum,
    type: 'title' | 'description',
  ): string => {
    const modeKey = mode;
    const suffix =
      type === 'title' ? 'deployment_mode' : 'deployment_mode_description';
    return `pci_instances_common_instance_${modeKey}_${suffix}`;
  };

  const deploymentModes: TDeploymentMode[] = DEPLOYMENT_MODES_CONFIG.map(
    (config) => ({
      mode: config.mode,
      title: t(getTranslationKey(config.mode, 'title')),
      description: t(getTranslationKey(config.mode, 'description')),
      Image: () => (
        <Icon imagePath={config.imagePath} width={120} height={80} />
      ),
      isDefaultActive: config.isDefaultActive,
    }),
  );

  const handleSelect = (selectedMode: cloud.RegionTypeEnum) => () => {
    const currentValue = value || [];
    const isSelected = value?.some((item) => item === selectedMode) || false;

    const selection = isSelected
      ? currentValue.filter((mode) => mode !== selectedMode)
      : [...currentValue, selectedMode];

    onChange(selection);
  };

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        {deploymentModes.map((deploymentMode) => {
          const { mode, title, description, Image } = deploymentMode;
          const isSelected = value?.some((item) => item === mode);

          return (
            <CheckboxTile
              checked={isSelected}
              onCheckedChange={handleSelect(mode)}
              key={mode}
            >
              <div className="flex flex-row items-center gap-4 ">
                <div className="flex justify-between w-full">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckboxIndicator />
                      <p className="font-bold text-sm text-[--ods-color-heading]">
                        {title}
                      </p>
                      <RegionTypeBadge type={mode} />
                    </div>
                    <div className="text-xs flex-1 flex flex-col mt-3">
                      {description}
                    </div>
                  </div>
                  <div>
                    <Image />
                  </div>
                </div>
              </div>
            </CheckboxTile>
          );
        })}
      </div>
    </section>
  );
};
