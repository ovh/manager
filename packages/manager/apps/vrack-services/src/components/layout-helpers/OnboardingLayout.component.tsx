import React from 'react';
import { OdsText, OdsButton } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
  ODS_BUTTON_COLOR,
} from '@ovhcloud/ods-components';
import { handleClick } from '@ovh-ux/manager-react-components';
import { PageLayout } from './PageLayout.component';

export type OnboardingLayoutProps = React.PropsWithChildren<{
  imageSrc?: string;
  introTitle?: string;
  intro?: string;
  title: string;
  description?: string;
  primaryButtonLabel?: string;
  primaryHref?: string;
  primaryOnClick?: () => void;
  primaryButtonSize?: ODS_BUTTON_SIZE;
  primaryButtonDisabled?: boolean;
  secondaryButtonLabel?: string;
  secondaryHref?: string;
  secondaryTarget?: string;
  secondaryOnClick?: () => void;
  secondaryButtonIcon?: ODS_ICON_NAME;
  secondaryButtonSize?: ODS_BUTTON_SIZE;
  secondaryButtonIconPosition?: 'left' | 'right';
  secondaryButtonDisabled?: boolean;
  noBreadcrumb?: boolean;
}>;

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  imageSrc,
  introTitle,
  intro,
  title,
  description,
  primaryButtonLabel,
  primaryHref,
  primaryOnClick,
  primaryButtonSize = ODS_BUTTON_SIZE.md,
  primaryButtonDisabled,
  secondaryButtonLabel,
  secondaryHref,
  secondaryTarget,
  secondaryOnClick,
  secondaryButtonIcon = ODS_ICON_NAME.externalLink,
  secondaryButtonSize = ODS_BUTTON_SIZE.md,
  secondaryButtonIconPosition = 'right',
  secondaryButtonDisabled,
  children,
}) => (
  <PageLayout noBreacrumb>
    <div className="flex flex-col mx-auto">
      <OdsText preset={ODS_TEXT_PRESET.heading4} className="block mb-6">
        {introTitle}
      </OdsText>
      <OdsText className="block mb-8" preset={ODS_TEXT_PRESET.paragraph}>
        {intro}
      </OdsText>
      <section className="flex flex-col items-center">
        <div className="flex justify-center py-8 max-h-28">
          <img className="max-h-150px" src={imageSrc} alt="" />
        </div>
        <OdsText
          preset={ODS_TEXT_PRESET.heading4}
          className="block text-center mb-6"
        >
          {title}
        </OdsText>
        <OdsText
          className="block text-center mb-6"
          preset={ODS_TEXT_PRESET.paragraph}
        >
          {description}
        </OdsText>
        <div className="flex mb-9 sm:py-8 xs:w-full xs:flex-col xs:space-y-4 sm:items-center sm:w-fit sm:flex-row sm:space-x-4 sm:space-y-0">
          {primaryButtonLabel && (primaryHref || primaryOnClick) && (
            <OdsButton
              isDisabled={primaryButtonDisabled}
              color={ODS_BUTTON_COLOR.primary}
              size={primaryButtonSize}
              {...(primaryOnClick ? handleClick(primaryOnClick) : {})}
              label={primaryButtonLabel}
            />
          )}
          {secondaryButtonLabel && (secondaryHref || secondaryOnClick) && (
            <OdsButton
              isDisabled={secondaryButtonDisabled}
              color={ODS_BUTTON_COLOR.primary}
              variant={ODS_BUTTON_VARIANT.outline}
              size={secondaryButtonSize}
              {...(secondaryOnClick ? handleClick(secondaryOnClick) : {})}
              label={secondaryButtonLabel}
              icon={secondaryButtonIcon}
              iconAlignment={secondaryButtonIconPosition}
            />
          )}
        </div>
      </section>
      {children}
    </div>
  </PageLayout>
);
