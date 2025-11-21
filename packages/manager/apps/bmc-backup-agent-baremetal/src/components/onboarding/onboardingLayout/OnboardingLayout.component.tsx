import React, { PropsWithChildren, useId } from 'react';

import { Link } from 'react-router-dom';

import { ODS_BUTTON_SIZE, ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsLink, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';

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
    <div className="flex sm:pt-8 xs:pt-2.5 flex-row items-center space-x-4 justify-center">
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
        <OdsLink
          onClick={onMoreInfoButtonClick}
          {...(isActionDisabled && { disabled: true })}
          href={moreInfoHref}
          label={moreInfoButtonLabel}
          icon={ODS_ICON_NAME.externalLink}
        />
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
    <div className="flex flex-col mx-auto sm:px-10">
      {!hideHeadingSection && (
        <section className="flex flex-col items-center">
          {(img?.src || placeholderImg) && (
            <div className="flex justify-center pt-8 max-h-28 w-full">
              <img
                {...imgProps}
                className="max-h-[150px]"
                src={img?.src ?? placeholderImg}
                alt=""
                width={img?.width}
                height={img?.height}
              />
            </div>
          )}
          <OdsText
            preset={ODS_TEXT_PRESET.heading1}
            className="block text-center sm:pt-8 xs:pt-2.5"
          >
            {title}
          </OdsText>
          {description && (
            <OdsText preset="span" className="[&::part(text)]:pt-0 [&::part(text)]:mt-0">
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
        <aside className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 xs:pt-10 sm:pt-20">
          {children}
        </aside>
      )}
    </div>
  );
};
