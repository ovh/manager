import clsx from 'clsx';
import { ReactNode, useMemo } from 'react';
import { TRegionType } from '@/pages/new/steps/LocationStep.component';
import RadioTile from '../radio-tile/RadioTile.component';

export interface KubeDeploymentTileProps {
  readonly title: string;
  readonly pillLabel: ReactNode;
  readonly description: string;
  readonly regionType: TRegionType;
  readonly selectedDeployment: TRegionType | undefined;
  readonly setSelectedDeployment: (r: TRegionType) => void;
}

export function KubeDeploymentTile({
  title,
  pillLabel,
  description,
  regionType,
  selectedDeployment,
  setSelectedDeployment,
}: KubeDeploymentTileProps) {
  const isSelected = useMemo(() => selectedDeployment === regionType, [
    selectedDeployment,
    regionType,
  ]);

  return (
    <RadioTile
      key={title}
      data-testid="deployment-tile-radio-tile"
      name="deployment-select"
      onChange={() => setSelectedDeployment(regionType)}
      value={title}
      checked={isSelected}
    >
      <div className="flex flex-col w-full items-center text-center space-y-4 px-[24px] py-[16px] min-h-[200px]">
        <h2
          className={clsx(
            'text-base text-[#4d5693]',
            isSelected ? 'font-bold' : 'font-normal',
          )}
        >
          {title}
        </h2>
        <span className="inline-block px-4">{pillLabel}</span>
        <p className="text-sm text-[#4d5693]">{description}</p>
      </div>
    </RadioTile>
  );
}
