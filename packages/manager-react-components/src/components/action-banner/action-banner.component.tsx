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
};

export function ActionBanner({
  message,
  cta,
  color,
  onClick,
  href,
  variant,
}: Readonly<ActionBannerProps>) {
  return (
    <OdsMessage
      color={color}
      variant={variant}
      className={'mt-3 flex-row'}
      data-testid="actionBanner-message_container"
    >
      <div className={'sm:flex sm:flex-row sm:justify-between sm:items-center'}>
        <OdsText>
          <span
            dangerouslySetInnerHTML={{
              __html: message,
            }}
          />
        </OdsText>
        {onClick && (
          <OdsButton
            className="sm:mt-0 mt-4 sm:ml-4 ml-0"
            data-testid="actionBanner-button"
            onClick={onClick}
            label={cta}
          />
        )}
        {href && (
          <OdsLink
            data-testid="action-banner-link"
            id="action-banner-link"
            className="sm:mt-0 mt-4 sm:ml-4 ml-0"
            onClick={() => onClick && onClick()}
            href={href}
            target={'_blank'}
          >
            {cta}
          </OdsLink>
        )}
      </div>
    </OdsMessage>
  );
}
