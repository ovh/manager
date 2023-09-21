import React from 'react';
import { OsdsText } from '@ovhcloud/ods-components/text/react/';
import { OsdsDivider } from '@ovhcloud/ods-components/divider/react/';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components/text';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import ButtonTooltip from '@/components/ButtonTooltip/ButtonTooltip';
import GuideLink from '@/components/GuideLink/GuideLink';

const TileToRename1: React.FC = () => {
  return (
    <>
      <div>
        <OsdsText
          level={ODS_TEXT_LEVEL.subheading}
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
                label: 'Label1',
              },
              {
                label: 'Label2',
              },
              {
                label: 'Label3',
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
            color={ODS_THEME_COLOR_INTENT.text}
          >
            Subtitle 2
          </OsdsText>
        </div>

        <div>
          <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
            <GuideLink name="guideLink1">Guide external link 1</GuideLink>
          </OsdsText>
        </div>
      </div>
      <OsdsDivider separator />
      <div>
        <div>
          <OsdsText
            level={ODS_TEXT_LEVEL.subheading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            Subtitle 3
          </OsdsText>
        </div>

        <div>
          <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
            <GuideLink name="guideLink2">Guide external link 2</GuideLink>
          </OsdsText>
        </div>
      </div>
      <OsdsDivider separator />
      <div>
        <div>
          <OsdsText
            level={ODS_TEXT_LEVEL.subheading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            Subtitle 4
          </OsdsText>
        </div>
      </div>
    </>
  );
};

export default TileToRename1;
