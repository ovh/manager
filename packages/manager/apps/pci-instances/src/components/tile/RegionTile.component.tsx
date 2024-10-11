import { RegionGlobalzoneChip } from '@ovh-ux/manager-pci-common/src/components/region-selector/RegionGlobalzoneChip.component';
import { RegionLocalzoneChip } from '@ovh-ux/manager-pci-common/src/components/region-selector/RegionLocalzoneChip.component';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsTile, OsdsText } from '@ovhcloud/ods-components/react';
import clsx from 'clsx';
import { FC } from 'react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { DeepReadonly } from '@/types/utils.type';

const blue100Var = '[--ods-color-blue-100]';
const blue600Var = '[--ods-color-blue-600]';
const borderBlue100 = `border-${blue100Var}`;
const borderBlue600 = `border-${blue600Var}`;
const baseClassName = `cursor-pointer ${borderBlue100} hover:bg-${blue100Var} hover:${borderBlue600}`;
const selectedClassName = `font-bold bg-${blue100Var} ${borderBlue600}`;
const disabledClassName = borderBlue100;

export type TRegionTileProps = DeepReadonly<{
  label: string;
  onTileClick?: () => void;
  isLocalzone?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
}>;

export const RegionTile: FC<TRegionTileProps> = ({
  label,
  isLocalzone,
  onTileClick,
  isSelected,
  isDisabled,
}) => (
  <OsdsTile
    className={clsx(
      isDisabled ? disabledClassName : baseClassName,
      isSelected && selectedClassName,
    )}
    disabled={isDisabled}
    {...(onTileClick && { onClick: onTileClick })}
  >
    <div className="flex flex-col w-full">
      <div className="py-3">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={isSelected ? ODS_TEXT_SIZE._500 : ODS_TEXT_SIZE._400}
        >
          {label}
        </OsdsText>
      </div>
      {isLocalzone !== undefined && (
        <>
          <hr className="w-full border-solid border-0 border-b border-b-[#85d9fd]" />
          <div className="py-3">
            {isLocalzone ? <RegionLocalzoneChip /> : <RegionGlobalzoneChip />}
          </div>
        </>
      )}
    </div>
  </OsdsTile>
);
