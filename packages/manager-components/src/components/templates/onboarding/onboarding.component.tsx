import React, { PropsWithChildren } from 'react';
import {
  OsdsButton,
  OsdsIcon,
  OsdsText,
  OsdsDivider,
} from '@ovhcloud/ods-components/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_DIVIDER_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';

import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import placeholderSrc from './assets/placeholder.png';

export type OnboardingLayoutProps = PropsWithChildren<{
  hideHeadingSection?: boolean;
  title: string;
  orderButtonLabel: string;
  orderHref?: string;
  description?: string;
  additionalDescriptions?: string[];
  moreInfoHref?: string;
  moreInfoButtonLabel?: string;
  onOrderButtonClick?: () => void;
  onmoreInfoButtonClick?: () => void;
  img?: {
    src: string;
    width?: number;
    height?: number;
  };
  isActionDisabled?: boolean;
}>;

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  hideHeadingSection,
  title,
  description,
  additionalDescriptions,
  orderHref,
  orderButtonLabel,
  moreInfoHref,
  moreInfoButtonLabel,
  children,
  onOrderButtonClick,
  onmoreInfoButtonClick,
  img,
  isActionDisabled,
}) => {
  return (
    <div className="flex flex-col mx-auto px-3">
      {!hideHeadingSection && (
        <section className="flex flex-col items-center">
          <div className="flex justify-center py-3 max-h-28">
            <img
              className="max-h-150px"
              src={img?.src ?? placeholderSrc}
              alt=""
              width={img?.width}
              height={img?.height}
            />
          </div>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.primary}
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._700}
            hue={ODS_THEME_COLOR_HUE._800}
            className="block text-center"
          >
            {title}
          </OsdsText>
          <OsdsDivider size={ODS_DIVIDER_SIZE.seven} />
          {description && (
            <OsdsText
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._800}
              color={ODS_TEXT_COLOR_INTENT.text}
              className="block text-center mb-4"
            >
              {description}
            </OsdsText>
          )}{' '}
          {additionalDescriptions?.map((desc) => (
            <OsdsText
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._800}
              color={ODS_TEXT_COLOR_INTENT.text}
              className="block text-center mb-4"
              key={desc}
            >
              {desc}
            </OsdsText>
          ))}
          <div className="flex  sm:py-8 xs:w-full xs:flex-col sm:items-center sm:flex-row w-full justify-center">
            <OsdsButton
              inline
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_BUTTON_SIZE.md}
              href={orderHref}
              onClick={onOrderButtonClick}
            >
              {orderButtonLabel}
            </OsdsButton>

            {moreInfoButtonLabel && moreInfoHref && (
              <OsdsButton
                inline
                className="sm:ml-1"
                color={ODS_THEME_COLOR_INTENT.primary}
                variant={ODS_BUTTON_VARIANT.stroked}
                size={ODS_BUTTON_SIZE.md}
                onClick={onmoreInfoButtonClick}
                {...(isActionDisabled && { disabled: true })}
                href={moreInfoHref}
                target={OdsHTMLAnchorElementTarget._blank}
              >
                {moreInfoButtonLabel}
                <span slot="end">
                  <OsdsIcon
                    className="ml-4 cursor-pointer"
                    name={ODS_ICON_NAME.EXTERNAL_LINK}
                    size={ODS_ICON_SIZE.xs}
                    hoverable
                  ></OsdsIcon>
                </span>
              </OsdsButton>
            )}
          </div>
        </section>
      )}
      {children}
    </div>
  );
};
