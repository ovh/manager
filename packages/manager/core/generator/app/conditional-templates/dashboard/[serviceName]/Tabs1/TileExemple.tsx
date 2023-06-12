import React from 'react';
import { OsdsText, OsdsDivider } from '@ovhcloud/ods-stencil/components/react/';
import {
  OdsThemeColorIntent,
  OdsThemeTypographyLevel,
} from '@ovhcloud/ods-theming';
import ButtonTooltip from '@/components/ButtonTooltip/ButtonTooltip';

const TileToRename1: React.FC = () => {
  return (
    <>
      <div>
        <OsdsText
          level={OdsThemeTypographyLevel.subheading}
          color={OdsThemeColorIntent.text}
        >
          Subtitle 1
        </OsdsText>
      </div>

      <div className="button-tooltip">
        <div className="element-tile-left">
          <OsdsText color={OdsThemeColorIntent.text}>Label</OsdsText>
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
            level={OdsThemeTypographyLevel.subheading}
            color={OdsThemeColorIntent.text}
          >
            Subtitle 2
          </OsdsText>
        </div>

        <div>
          <OsdsText color={OdsThemeColorIntent.text}>Label</OsdsText>
        </div>
      </div>
      <OsdsDivider separator />
      <div>
        <div>
          <OsdsText
            level={OdsThemeTypographyLevel.subheading}
            color={OdsThemeColorIntent.text}
          >
            Subtitle 3
          </OsdsText>
        </div>

        <div>
          <OsdsText color={OdsThemeColorIntent.text}>Label</OsdsText>
        </div>
      </div>
      <OsdsDivider separator />
      <div>
        <div>
          <OsdsText
            level={OdsThemeTypographyLevel.subheading}
            color={OdsThemeColorIntent.text}
          >
            Subtitle 4
          </OsdsText>
        </div>

        <div>
          <OsdsText color={OdsThemeColorIntent.text}>Label</OsdsText>
        </div>
      </div>
    </>
  );
};

export default TileToRename1;
