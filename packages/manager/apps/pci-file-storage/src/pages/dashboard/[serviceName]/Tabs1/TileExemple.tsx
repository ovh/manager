import React from 'react';
import { OsdsText, OsdsDivider } from '@ovhcloud/ods-components/react/';
import {
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import ButtonTooltip from '@/components/ButtonTooltip/ButtonTooltip';

const TileToRename1: React.FC = () => {
  return (
    <>
      <div>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.subheading}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          Subtitle 1
        </OsdsText>
      </div>

      <div className="button-tooltip">
        <div className="element-tile-left">
          <OsdsText color={ODS_THEME_COLOR_INTENT.text}>Label</OsdsText>
        </div>
        <div className="element-tile-right">
          <ButtonTooltip
            tooltipContent={[
              {
                label: 'Label',
              },
              {
                label: 'Label',
              },
              {
                label: 'Label',
              },
            ]}
          />
        </div>
      </div>

      <OsdsDivider separator />

      <div>
        <div>
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.subheading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            Subtitle 2
          </OsdsText>
        </div>

        <div>
          <OsdsText color={ODS_THEME_COLOR_INTENT.text}>Label</OsdsText>
        </div>
      </div>
      <OsdsDivider separator />
      <div>
        <div>
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.subheading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            Subtitle 3
          </OsdsText>
        </div>

        <div>
          <OsdsText color={ODS_THEME_COLOR_INTENT.text}>Label</OsdsText>
        </div>
      </div>
      <OsdsDivider separator />
      <div>
        <div>
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.subheading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            Subtitle 4
          </OsdsText>
        </div>

        <div>
          <OsdsText color={ODS_THEME_COLOR_INTENT.text}>Label</OsdsText>
        </div>
      </div>
    </>
  );
};

export default TileToRename1;
