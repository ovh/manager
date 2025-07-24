import {
  ODS_BUTTON_ICON_ALIGNMENT,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { Icon, ICON_NAME } from '@ovhcloud/ods-react';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { Button } from '../../button';
import React, { PropsWithChildren } from 'react';

import placeholderSrc from '../../../../public/assets/placeholder.png';

type OnboardingLayoutButtonProps = {
  orderButtonLabel?: string;
  orderHref?: string;
  onOrderButtonClick?: () => void;
  isActionDisabled?: boolean;
  orderIam?: {
    urn: string;
    iamActions: string[];
    displayTooltip?: boolean;
  };
  moreInfoHref?: string;
  moreInfoButtonIcon?: ODS_ICON_NAME;
  moreInfoButtonLabel?: string;
  /**
   * @deprecated use onMoreInfoButtonClick
   */
  onmoreInfoButtonClick?: () => void;
  onMoreInfoButtonClick?: () => void;
  isMoreInfoButtonDisabled?: boolean;
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
  onOrderButtonClick,
  isActionDisabled,
  orderIam,
  moreInfoHref,
  moreInfoButtonLabel,
  moreInfoButtonIcon = ICON_NAME.externalLink,
  /**
   * @deprecated use onMoreInfoButtonClick
   */
  onmoreInfoButtonClick,
  onMoreInfoButtonClick,
  isMoreInfoButtonDisabled,
}) => {
  if (!orderButtonLabel && !moreInfoButtonLabel) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full sm:w-fit sm:flex-row sm:items-center sm:justify-center">
      {orderButtonLabel && (onOrderButtonClick || orderHref) && (
        <Button
          className="[&::part(button)]:w-full sm:w-auto"
          size={ODS_BUTTON_SIZE.md}
          onClick={() => {
            onOrderButtonClick?.();
            if (orderHref) {
              window.open(orderHref, '_blank');
            }
          }}
          disabled={isActionDisabled}
          {...(orderIam || {})}
        >
          {orderButtonLabel}
        </Button>
      )}
      {moreInfoButtonLabel &&
        (onmoreInfoButtonClick || onMoreInfoButtonClick || moreInfoHref) && (
          <Button
            className="[&::part(button)]:w-full sm:w-auto"
            size={ODS_BUTTON_SIZE.md}
            variant={ODS_BUTTON_VARIANT.outline}
            onClick={() => {
              if (!isMoreInfoButtonDisabled) {
                // TODO: to delete on next major version
                onmoreInfoButtonClick?.();
                onMoreInfoButtonClick?.();
                if (moreInfoHref) {
                  window.open(moreInfoHref, '_blank');
                }
              }
            }}
            disabled={isMoreInfoButtonDisabled}
          >
            <>
              {moreInfoButtonLabel}
              <Icon
                aria-label={moreInfoButtonLabel}
                name={moreInfoButtonIcon}
              />
            </>
          </Button>
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
  isActionDisabled,
  orderIam,
  onOrderButtonClick,
  moreInfoHref,
  moreInfoButtonLabel,
  moreInfoButtonIcon,
  isMoreInfoButtonDisabled,
  /**
   * @deprecated use onMoreInfoButtonClick
   */
  onmoreInfoButtonClick,
  onMoreInfoButtonClick,
  img = {},
  children,
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
            onMoreInfoButtonClick={onMoreInfoButtonClick}
            orderButtonLabel={orderButtonLabel}
            moreInfoHref={moreInfoHref}
            moreInfoButtonLabel={moreInfoButtonLabel}
            orderIam={orderIam}
            moreInfoButtonIcon={moreInfoButtonIcon}
            isMoreInfoButtonDisabled={isMoreInfoButtonDisabled}
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
