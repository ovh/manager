import { OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

interface PciTileProps {
  title: string;
  description?: string;
  isChecked?: boolean;
  onClick?: () => void;
}

const checkedClass =
  'cursor-pointer font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600]';
const uncheckedClass =
  'cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600]';

// @TODO move to pci common
export function PciTile({
  title,
  description,
  isChecked,
  onClick,
}: Readonly<PciTileProps>) {
  return (
    <OsdsTile
      className={isChecked ? checkedClass : uncheckedClass}
      checked={isChecked}
      onClick={() => onClick?.()}
    >
      <div className="w-full">
        <OsdsText
          className="font-bold"
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {title}
        </OsdsText>
        {description && (
          <div className="mt-4">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {description}
            </OsdsText>
          </div>
        )}
      </div>
    </OsdsTile>
  );
}
