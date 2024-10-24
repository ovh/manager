import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import React, { PropsWithChildren } from 'react';

import placeholderImg from '../../../../public/assets/placeholder.png';

import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';

type OnboardingLayoutButtonProps = {
  orderButtonLabel?: string;
  orderHref?: string;
  moreInfoHref?: string;
  moreInfoButtonLabel?: string;
  onOrderButtonClick?: () => void;
  onmoreInfoButtonClick?: () => void;
  isActionDisabled?: boolean;
};

export type OnboardingLayoutProps = OnboardingLayoutButtonProps &
  PropsWithChildren<{
    hideHeadingSection?: boolean;
    title: string;
    description?: React.ReactNode;
    img?: React.ComponentProps<'img'>;
  }>;

const OnboardingLayoutButton: React.FC<OnboardingLayoutButtonProps> = ({
  orderHref,
  orderButtonLabel,
  moreInfoHref,
  moreInfoButtonLabel,
  onOrderButtonClick,
  onmoreInfoButtonClick,
  isActionDisabled,
}) => {
  if (!orderButtonLabel && !moreInfoButtonLabel) {
    return <></>;
  }
  return (
    <div className="flex sm:pt-8 xs:pt-2.5 flex-row items-center space-x-4 justify-center">
      {orderButtonLabel && (
        <OsdsButton
          inline
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_BUTTON_SIZE.md}
          href={orderHref}
          onClick={onOrderButtonClick}
          disabled={(!onOrderButtonClick && !orderHref) || undefined}
        >
          {orderButtonLabel}
        </OsdsButton>
      )}

      {moreInfoButtonLabel && moreInfoHref && (
        <OsdsButton
          inline
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
  );
};

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  hideHeadingSection,
  title,
  description,
  orderHref,
  orderButtonLabel,
  moreInfoHref,
  moreInfoButtonLabel,
  children,
  onOrderButtonClick,
  onmoreInfoButtonClick,
  img = {},
  isActionDisabled,
}) => {
  const { className: imgClassName, ...imgProps } = img;
  return (
    <div className="flex flex-col mx-auto sm:px-10">
      {!hideHeadingSection && (
        <section className="flex flex-col items-center mt-8">
          <img
            className={`max-h-28 ${imgClassName ?? ''}`}
            src={placeholderImg}
            {...imgProps}
          />
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.primary}
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._700}
            hue={ODS_THEME_COLOR_HUE._800}
            className="block text-center sm:pt-8 xs:pt-2.5"
          >
            {title}
          </OsdsText>
          {description && (
            <OsdsText
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._400}
              color={ODS_TEXT_COLOR_INTENT.text}
              className="block text-center xs:pt-2.5 sm:pt-8 max-w-4xl"
            >
              {description}
            </OsdsText>
          )}
          <OnboardingLayoutButton
            isActionDisabled={isActionDisabled}
            orderHref={orderHref}
            onOrderButtonClick={onOrderButtonClick}
            onmoreInfoButtonClick={onmoreInfoButtonClick}
            orderButtonLabel={orderButtonLabel}
            moreInfoHref={moreInfoHref}
            moreInfoButtonLabel={moreInfoButtonLabel}
          />
        </section>
      )}
      {children && (
        <aside className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 xs:pt-10 sm:pt-20">
          {children}
        </aside>
      )}
    </div>
  );
};
