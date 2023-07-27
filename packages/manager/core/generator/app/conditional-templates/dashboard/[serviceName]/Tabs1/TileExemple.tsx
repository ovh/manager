import React from 'react';
import { OsdsDivider } from '@ovhcloud/ods-stencil/components/react/';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components/text';
import {
  OdsThemeColorIntent
} from '@ovhcloud/ods-theming';
import ButtonTooltip from '@/components/ButtonTooltip/ButtonTooltip';

const TileToRename1: React.FC = () => {
  return (
    <>
      <div>
        <OsdsText
          level={ODS_TEXT_LEVEL.subheading}
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
            level={ODS_TEXT_LEVEL.subheading}
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
            level={ODS_TEXT_LEVEL.subheading}
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
            level={ODS_TEXT_LEVEL.subheading}
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
