import React from 'react';
import {
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsSpinner, OsdsText } from '@ovhcloud/ods-components/react';

export type LoadingTextProps = {
  title: string;
  description?: string;
};

export const LoadingText: React.FC<LoadingTextProps> = ({
  title,
  description,
}) => (
  <div className="flex items-center">
    <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
    <div className="ml-5 mb-3 flex flex-col">
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._200}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {title}
      </OsdsText>
      {description && (
        <OsdsText
          className="block"
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._200}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {description}
        </OsdsText>
      )}
    </div>
  </div>
);
