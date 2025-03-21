import { FC, PropsWithChildren } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

type TileLabelProps = {
  title: string;
  description?: string;
};

const TileLabel: FC<PropsWithChildren<TileLabelProps>> = ({
  title,
  description,
  children,
}) => (
  <div className="grid grid-cols-1 gap-2 text-left text w-full">
    <div className="text-sm">
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        size={ODS_THEME_TYPOGRAPHY_SIZE._200}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {title}
      </OsdsText>
    </div>
    {description && (
      <div className="text-sm font-normal">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
          size={ODS_THEME_TYPOGRAPHY_SIZE._200}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {description}
        </OsdsText>
      </div>
    )}
    <hr className="w-full border-solid border-0 border-b border-[--ods-color-blue-200]" />
    {children}
  </div>
);

export default TileLabel;
