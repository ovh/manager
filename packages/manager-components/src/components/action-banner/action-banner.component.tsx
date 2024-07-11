import React from 'react';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { LinkType, Links } from '../typography';

export enum BannerSize {
  classic = 'max-w-4xl',
  full = 'max-w-full',
}

export type ActionBannerProps = {
  title?: string;
  description?: string;
  cta: string;
  type?: ODS_MESSAGE_TYPE;
  onClick: () => void;
  isRemovable?: boolean;
  className?: string;
  size?: BannerSize;
};

export function ActionBanner({
  title,
  description,
  cta,
  type = ODS_MESSAGE_TYPE.info,
  onClick,
  isRemovable,
  size = BannerSize.classic,
  className,
}: Readonly<ActionBannerProps>) {
  return (
    <OsdsMessage
      type={type}
      color={type as unknown as ODS_THEME_COLOR_INTENT}
      className={`mt-3 flex flex-row items-center ${size} ${className}`}
      data-testid="actionBanner-message_container"
      removable={isRemovable}
    >
      <div className="grid">
        {title && (
          <OsdsText
            size={ODS_THEME_TYPOGRAPHY_SIZE._200}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
            hue={ODS_THEME_COLOR_HUE._900}
            className="block mb-3"
          >
            {title}
          </OsdsText>
        )}
        {description && (
          <div>
            <OsdsText
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {description}
            </OsdsText>
          </div>
        )}
        {cta && (
          <Links
            label={cta}
            type={LinkType.next}
            onClickReturn={onClick}
            className="mt-3"
          />
        )}
      </div>
    </OsdsMessage>
  );
}
