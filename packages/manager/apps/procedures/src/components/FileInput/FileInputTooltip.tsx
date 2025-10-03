import React, { FunctionComponent } from 'react';

import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_LEVEL } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';

type Props = {
  tooltips?: string[];
};
export const FileInputTooltip: FunctionComponent<Props> = ({ tooltips }) => {
  if (!tooltips?.length) return <></>;

  return (
    <ul>
      {tooltips.map((tooltip, index) => (
        <li key={index}>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
            size={ODS_TEXT_SIZE._100}
          >
            {`${tooltips.length > 1 ? '- ' : ''}${tooltip}`}
          </OsdsText>
        </li>
      ))}
    </ul>
  );
};
