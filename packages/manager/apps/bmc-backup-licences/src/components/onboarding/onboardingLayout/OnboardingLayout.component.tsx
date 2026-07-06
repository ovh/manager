import React, { PropsWithChildren, useId } from 'react';

import { Link } from 'react-router-dom';

import { ODS_BUTTON_SIZE, ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';

import placeholderImg from '@/../public/assets/img.png';

type OnboardingLayoutButtonProps = {
  orderButtonLabel?: string;
  orderHref?: string;
  moreInfoHref?: string;
  moreInfoButtonLabel?: string;
  onOrderButtonClick?: () => void;
  onMoreInfoButtonClick?: () => void;
  isActionDisabled?: boolean;
  tooltipContent?: string;
  isOrderDisabled?: boolean;
  isOrderLoading?: boolean;
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
  onMoreInfoButtonClick,
  isActionDisabled,
  tooltipContent,
  isOrderDisabled,
  isOrderLoading,
}) => {
  const tooltipId = useId();
  if (!orderButtonLabel || !moreInfoButtonLabel || !orderHref) {
    return null;
  }
  return (
    <div className="flex flex-row items-center justify-center space-x-4 xs:pt-2.5 sm:pt-8">
      <Link id={tooltipId} to={!isOrderDisabled && !isOrderLoading ? orderHref : ''}>
        <OdsButton
          size={ODS_BUTTON_SIZE.md}
          onClick={onOrderButtonClick}
          label={orderButtonLabel}
          isLoading={isOrderLoading}
          isDisabled={isOrderDisabled || isOrderLoading}
        />
      </Link>
      {tooltipContent && <OdsTooltip triggerId={tooltipId}>{tooltipContent}</OdsTooltip>}

      {moreInfoButtonLabel && moreInfoHref && (
        <a href={moreInfoHref} rel="noopener noreferrer" target="_blank">
          <OdsButton
            variant="outline"
            size={ODS_BUTTON_SIZE.md}
            onClick={onMoreInfoButtonClick}
            label={moreInfoButtonLabel}
            isDisabled={isActionDisabled}
            icon={ODS_ICON_NAME.externalLink}
          />
        </a>
      )}
    </div>
  );
};

/* eslint-disable react/no-multi-comp */
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
  onMoreInfoButtonClick,
  img = {},
  isActionDisabled,
  tooltipContent,
  isOrderDisabled,
  isOrderLoading,
}) => {
  const { ...imgProps } = img;
  return (
    <div className="mx-auto flex flex-col sm:px-10">
      {!hideHeadingSection && (
        <section className="flex flex-col items-center">
          {(img?.src || placeholderImg) && (
            <div className="flex max-h-48 w-full justify-center pt-8">
              <img
                {...imgProps}
                src={img?.src ?? placeholderImg}
                alt=""
                width={img?.width}
                height={img?.height}
              />
            </div>
          )}
          <OdsText
            preset={ODS_TEXT_PRESET.heading1}
            className="block text-center xs:pt-2.5 sm:pt-8"
          >
            {title}
          </OdsText>
          {description && (
            <OdsText preset="span" className="[&::part(text)]:mt-0 [&::part(text)]:pt-0">
              {description}
            </OdsText>
          )}
          <OnboardingLayoutButton
            isActionDisabled={isActionDisabled}
            orderHref={orderHref}
            onOrderButtonClick={onOrderButtonClick}
            onMoreInfoButtonClick={onMoreInfoButtonClick}
            orderButtonLabel={orderButtonLabel}
            moreInfoHref={moreInfoHref}
            moreInfoButtonLabel={moreInfoButtonLabel}
            tooltipContent={tooltipContent}
            isOrderDisabled={isOrderDisabled}
            isOrderLoading={isOrderLoading}
          />
        </section>
      )}
      {children && (
        <aside className="grid grid-cols-1 gap-6 xs:pt-10 sm:grid-cols-2 sm:pt-20 md:grid-cols-3">
          {children}
        </aside>
      )}
    </div>
  );
};
