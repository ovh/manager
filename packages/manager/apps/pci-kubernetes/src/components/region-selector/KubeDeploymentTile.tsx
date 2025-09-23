import clsx from 'clsx';
import { ComponentType, ReactNode } from 'react';
import RadioTile from '../radio-tile/RadioTile.component';

export interface KubeDeploymentTileProps {
  title: string;
  pillLabel: ReactNode;
  description: string;
  isSelected?: boolean;
  badge: ComponentType;
  onSelectedDeployment: () => void;
}

export function KubeDeploymentTile({
  title,
  badge,
  pillLabel,
  description,
  onSelectedDeployment,
  isSelected,
}: Readonly<KubeDeploymentTileProps>) {
  const BadgeComponent = badge;

  return (
    <RadioTile
      key={title}
      data-testid="deployment-tile-radio-tile"
      name="deployment-select"
      onChange={onSelectedDeployment}
      value={title}
      checked={isSelected}
    >
      <div className="flex flex-col w-full items-center text-center space-y-4 px-[24px] py-[16px] min-h-[200px]">
        <div className="flex flex-col lg:flex-row gap-4">
          <h2
            className={clsx(
              'text-base text-[#4d5693]',
              isSelected ? 'font-bold' : 'font-normal',
            )}
          >
            {title}
          </h2>
          <span>
            <BadgeComponent />
          </span>
        </div>
        <span className="inline-block px-4">{pillLabel}</span>
        <p className="text-sm text-[#4d5693]">{description}</p>
      </div>
    </RadioTile>
  );
}
