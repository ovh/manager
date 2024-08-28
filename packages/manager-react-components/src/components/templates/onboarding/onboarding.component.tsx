import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsText, OdsLink } from '@ovhcloud/ods-components/react';
import React, { PropsWithChildren } from 'react';

import placeholderImg from '../../../../public/assets/placeholder.png';

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
      <OdsButton
        size={ODS_BUTTON_SIZE.md}
        onClick={onOrderButtonClick}
        label={orderButtonLabel}
      />

      {moreInfoButtonLabel && moreInfoHref && (
        <OdsLink
          onClick={onmoreInfoButtonClick}
          {...(isActionDisabled && { disabled: true })}
          href={moreInfoHref}
          label={moreInfoButtonLabel}
          icon={ODS_ICON_NAME.externalLink}
        />
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
            <OdsText preset="span" className="onboarding-description">
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
