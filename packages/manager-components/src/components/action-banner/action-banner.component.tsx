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
      <div className={'flex flex-row justify-between'}>
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
          size={ODS_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => {
            if (onClick) {
              onClick();
            }
          }}
        >
          {cta}
        </OsdsButton>
      </div>
    </OsdsMessage>
  );
}
