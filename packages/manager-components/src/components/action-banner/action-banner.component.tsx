import React from 'react';
import {
  OsdsButton,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

export interface ActionBannerProps {
  message: string;
  cta: string;
  onClick: () => void;
}

export function ActionBanner({ message, cta, onClick }: ActionBannerProps) {
  return (
    <OsdsMessage
      type={ODS_MESSAGE_TYPE.warning}
      color={ODS_THEME_COLOR_INTENT.warning}
      className={'mt-3 flex-row'}
    >
      <div className={'sm:flex sm:flex-row sm:justify-between sm:items-center'}>
        <OsdsText
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.default}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: message,
            }}
          ></span>
        </OsdsText>
        <OsdsButton
          data-testid="cta"
          className="sm:mt-0 mt-4 sm:ml-4 ml-0"
          size={ODS_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={onClick}
        >
          {cta}
        </OsdsButton>
      </div>
    </OsdsMessage>
  );
}
