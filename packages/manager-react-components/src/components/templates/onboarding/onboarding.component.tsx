import {
  ODS_BUTTON_ICON_ALIGNMENT,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { ManagerButton } from '../../ManagerButton/ManagerButton';
import React, { PropsWithChildren } from 'react';

import placeholderSrc from '../../../../public/assets/placeholder.png';

type OnboardingLayoutButtonProps = {
  orderButtonLabel?: string;
  orderHref?: string;
  moreInfoHref?: string;
  moreInfoIcon?: ODS_ICON_NAME;
  moreInfoButtonLabel?: string;
  onOrderButtonClick?: () => void;
  onmoreInfoButtonClick?: () => void;
  isActionDisabled?: boolean;
  orderIam?: {
    urn: string;
    iamActions: string[];
    displayTooltip?: boolean;
  };
  isMoreInfoDisabled?: boolean;
};

export type OnboardingLayoutProps = OnboardingLayoutButtonProps &
  PropsWithChildren<{
    hideHeadingSection?: boolean;
    title: string;
    description?: React.ReactNode;
    img?: React.ComponentProps<'img'>;
  }>;

const OnboardingLayoutButton: React.FC<OnboardingLayoutButtonProps> = ({
  orderButtonLabel,
  orderHref,
  moreInfoHref,
  moreInfoButtonLabel,
  moreInfoIcon = ODS_ICON_NAME.externalLink,
  onOrderButtonClick,
  onmoreInfoButtonClick,
  isActionDisabled,
  orderIam,
  isMoreInfoDisabled,
}) => {
  if (!orderButtonLabel && !moreInfoButtonLabel) {
    return <></>;
  }
  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full sm:w-fit sm:flex-row sm:items-center sm:justify-center">
      {orderButtonLabel && (onOrderButtonClick || orderHref) && (
        <ManagerButton
          id="orderButton"
          className="[&::part(button)]:w-full sm:w-auto"
          size={ODS_BUTTON_SIZE.md}
          onClick={() => {
            onOrderButtonClick?.();
            if (orderHref) {
              window.open(orderHref, '_blank');
            }
          }}
          label={orderButtonLabel}
          isDisabled={isActionDisabled}
          {...(orderIam || {})}
        />
      )}
      {moreInfoButtonLabel && (onmoreInfoButtonClick || moreInfoHref) && (
        <OdsButton
          className="[&::part(button)]:w-full sm:w-auto"
          size={ODS_BUTTON_SIZE.md}
          variant={ODS_BUTTON_VARIANT.outline}
          onClick={() => {
            if (!isMoreInfoDisabled) {
              onmoreInfoButtonClick?.();
              if (moreInfoHref) {
                window.open(moreInfoHref, '_blank');
              }
            }
          }}
          label={moreInfoButtonLabel}
          icon={moreInfoIcon}
          iconAlignment={ODS_BUTTON_ICON_ALIGNMENT.right}
          isDisabled={isMoreInfoDisabled}
        />
      )}
    </div>
  );
};

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  hideHeadingSection,
  title,
  description,
  orderButtonLabel,
  orderHref,
  moreInfoHref,
  moreInfoButtonLabel,
  moreInfoIcon,
  isMoreInfoDisabled,
  children,
  onOrderButtonClick,
  onmoreInfoButtonClick,
  img = {},
  isActionDisabled,
  orderIam,
}) => {
  const { className: imgClassName, alt: altText, ...imgProps } = img;
  return (
    <div className="flex flex-col mx-auto sm:px-10">
      {!hideHeadingSection && (
        <section className="flex flex-col items-center gap-6 pt-6 max-w-[800px] self-center">
          {(img?.src || placeholderSrc) && (
            <div className="flex justify-center">
              <img
                {...imgProps}
                className={`max-h-[150px] ${imgClassName}`}
                src={img?.src ?? placeholderSrc}
                alt={altText ?? 'placeholder image'}
              />
            </div>
          )}
          <OdsText
            preset={ODS_TEXT_PRESET.heading1}
            className="block text-center"
          >
            {title}
          </OdsText>
          {description}
          <OnboardingLayoutButton
            isActionDisabled={isActionDisabled}
            orderHref={orderHref}
            onOrderButtonClick={onOrderButtonClick}
            onmoreInfoButtonClick={onmoreInfoButtonClick}
            orderButtonLabel={orderButtonLabel}
            moreInfoHref={moreInfoHref}
            moreInfoButtonLabel={moreInfoButtonLabel}
            orderIam={orderIam}
            moreInfoIcon={moreInfoIcon}
            isMoreInfoDisabled={isMoreInfoDisabled}
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
