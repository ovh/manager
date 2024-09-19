import React from 'react';
import {
  OsdsButton,
  OsdsLink,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

export type ActionBannerProps = {
  message: string;
  cta: string;
  type?: ODS_MESSAGE_TYPE;
  onClick?: () => void;
  href?: string;
  className?: string;
};

export function ActionBanner({
  message,
  cta,
  type = ODS_MESSAGE_TYPE.info,
  onClick,
  href,
  className,
}: Readonly<ActionBannerProps>) {
  return (
    <OsdsMessage
      type={type}
      color={(type as unknown) as ODS_THEME_COLOR_INTENT}
      className={`mt-3 flex-row ${className || ''}`.trim()}
      data-testid="actionBanner-message_container"
    >
      <div className="sm:flex sm:flex-row sm:justify-between sm:items-center">
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
        {onClick && (
          <OsdsButton
            className="sm:mt-0 mt-4 sm:ml-4 ml-0"
            data-testid="actionBanner-button"
            size={ODS_BUTTON_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={onClick}
          >
            {cta}
          </OsdsButton>
        )}
        {href && (
          <OsdsLink
            className="sm:mt-0 mt-4 sm:ml-4 ml-0"
            color={ODS_THEME_COLOR_INTENT.primary}
            href={href}
            target={OdsHTMLAnchorElementTarget._blank}
          >
            {cta}
          </OsdsLink>
        )}
      </div>
    </OsdsMessage>
  );
}
