import React from 'react';
import {
  OdsButton,
  OdsLink,
  OdsMessage,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_COLOR,
  ODS_MESSAGE_VARIANT,
} from '@ovhcloud/ods-components';

export type ActionBannerProps = {
  message: string;
  cta: string;
  variant?: ODS_MESSAGE_VARIANT;
  color?: ODS_MESSAGE_COLOR;
  onClick?: () => void;
  href?: string;
  className?: string;
  isDismissible?: boolean;
};

export function ActionBanner({
  message,
  cta,
  color,
  onClick,
  href,
  variant,
  isDismissible = false,
}: Readonly<ActionBannerProps>) {
  return (
    <OdsMessage
      isDismissible={isDismissible}
      color={color}
      variant={variant}
      className={`mt-3 action-banner action-banner—-${color}`}
      data-testid="actionBanner-message_container"
    >
      <div className="w-full">
        <OdsText className="action-banner__text block">
          <span
            dangerouslySetInnerHTML={{
              __html: message,
            }}
          />
        </OdsText>
        {onClick && (
          <OdsButton
            className="sm:mt-0 mt-4 ml-0"
            data-testid="actionBanner-button"
            onClick={onClick}
            label={cta}
          />
        )}
        {href && (
          <OdsLink
            data-testid="action-banner-link"
            id="action-banner-link"
            className="sm:mt-0 mt-4 ml-0"
            onClick={onClick}
            href={href}
            target="_blank"
            label={cta}
          ></OdsLink>
        )}
      </div>
    </OdsMessage>
  );
}
