import {
  ODS_BUTTON_ICON_ALIGNMENT,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
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
}) => {
  if (!orderButtonLabel && !moreInfoButtonLabel) {
    return <></>;
  }
  return (
    <div className="flex sm:pt-8 xs:pt-2.5 flex-row items-center space-x-4 justify-center">
      <OdsButton
        size={ODS_BUTTON_SIZE.md}
        onClick={() => {
          onOrderButtonClick?.();
          if (orderHref) {
            window.open(orderHref, '_blank');
          }
        }}
        label={orderButtonLabel}
        isDisabled={isActionDisabled}
      />
      {moreInfoButtonLabel && (onmoreInfoButtonClick || moreInfoHref) && (
        <OdsButton
          size={ODS_BUTTON_SIZE.md}
          variant={ODS_BUTTON_VARIANT.outline}
          onClick={() => {
            onmoreInfoButtonClick?.();
            if (moreInfoHref) {
              window.open(moreInfoHref, '_blank');
            }
          }}
          label={moreInfoButtonLabel}
          icon={moreInfoIcon}
          iconAlignment={ODS_BUTTON_ICON_ALIGNMENT.right}
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
        <section className="flex flex-col items-center">
          {(img?.src || placeholderSrc) && (
            <div className="flex justify-center pt-8 max-h-28 w-full">
              <img
                {...imgProps}
                className="max-h-[150px]"
                src={img?.src ?? placeholderSrc}
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
            <OdsText
              preset="paragraph"
              className="block text-center xs:pt-2.5 sm:pt-8 max-w-4xl"
            >
              {description}
            </OdsText>
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
