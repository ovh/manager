import { ComponentType, ReactNode } from 'react';

import clsx from 'clsx';

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
      <article className="flex flex-col items-center text-center  px-[24px] py-[16px] gap-4 lg:gap-2  rounded-md">
        <div className="flex flex-col lg:flex-row gap-1 lg:gap-4 items-center lg:items-baseline">
          <h2
            className={clsx(
              'text-base text-[--ods-color-text-500] mb-0 lg:mb-2',
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
        <p className="text-sm text-[--ods-color-text-500]">{description}</p>
      </article>
    </RadioTile>
  );
}
