import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsCheckbox,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import React, { Dispatch, ReactNode, SetStateAction } from 'react';

type IdentitiesBaseTileProps = {
  title: string;
  urn: string;
  updateCallback: (isSelected: boolean) => void;
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
};

const IdentitiesBaseTile = ({
  title,
  urn,
  updateCallback,
  isChecked,
  setIsChecked,
  children,
}: IdentitiesBaseTileProps) => {
  return (
    <OsdsCheckbox
      value={urn}
      checked={isChecked}
      onClick={() => {
        setIsChecked(!isChecked);
        updateCallback(!isChecked);
      }}
    >
      <OsdsTile
        hoverable
        color={isChecked ? ODS_THEME_COLOR_INTENT.primary : undefined}
      >
        <div slot="start" className="flex flex-col gap-3">
          <OsdsText
            level={ODS_TEXT_LEVEL.subheading}
            size={ODS_TEXT_SIZE._100}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {title}
          </OsdsText>
          <div className="flex flex-col pl-3 gap-3">{children}</div>
        </div>
      </OsdsTile>
    </OsdsCheckbox>
  );
};

export default IdentitiesBaseTile;
