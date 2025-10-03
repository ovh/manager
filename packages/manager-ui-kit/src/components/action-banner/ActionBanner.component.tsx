import React from 'react';
import DOMPurify from 'dompurify';
import { Button, Link, Message, Text, BUTTON_SIZE } from '@ovhcloud/ods-react';
import { ActionBannerProps } from './ActionBanner.props';

export function ActionBanner({
  message,
  label,
  color,
  onClick,
  href,
  variant,
  dismissible = false,
}: Readonly<ActionBannerProps>) {
  return (
    <Message
      dismissible={dismissible}
      color={color}
      variant={variant}
      className={`mt-3 action-banner action-banner—-${color}`}
      data-testid="actionBanner-message_container"
    >
      <div className="w-full">
        <Text className="action-banner__text block">
          <span
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(message),
            }}
          />
        </Text>
        {href && (
          <Link
            data-testid="action-banner-link"
            id="action-banner-link"
            className="sm:mt-0 md:mt-2 ml-0"
            href={href}
            target="_blank"
          >
            {label}
          </Link>
        )}
        {onClick && !href && (
          <Button
            className="sm:mt-0 md:mt-2 ml-0"
            data-testid="action-banner-button"
            onClick={onClick}
            size={BUTTON_SIZE.xs}
          >
            {label}
          </Button>
        )}
      </div>
    </Message>
  );
}
