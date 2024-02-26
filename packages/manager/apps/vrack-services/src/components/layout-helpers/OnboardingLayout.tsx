import React from 'react';
import {
  OsdsIcon,
  OsdsText,
  OsdsButton,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { PageLayout } from './PageLayout';
import { handleClick } from '@/utils/ods-utils';

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
  primaryButtonDataTracking?: string;
  secondaryButtonLabel?: string;
  secondaryHref?: string;
  secondaryOnClick?: () => void;
  secondaryButtonIcon?: ODS_ICON_NAME;
  secondaryButtonSize?: ODS_BUTTON_SIZE;
  secondaryButtonIconPosition?: 'start' | 'end';
  secondaryButtonDisabled?: boolean;
  secondaryButtonDataTracking?: string;
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
  primaryButtonDataTracking,
  secondaryButtonLabel,
  secondaryHref,
  secondaryOnClick,
  secondaryButtonIcon = ODS_ICON_NAME.EXTERNAL_LINK,
  secondaryButtonSize = ODS_BUTTON_SIZE.md,
  secondaryButtonIconPosition = 'end',
  secondaryButtonDisabled,
  secondaryButtonDataTracking,
  children,
}) => {
  return (
    <PageLayout noBreacrumb>
      <div className="flex flex-col mx-auto">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.heading}
          size={ODS_TEXT_SIZE._600}
          className="block mb-6"
        >
          {introTitle}
        </OsdsText>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          className="block mb-8"
        >
          {intro}
        </OsdsText>
        <section className="flex flex-col items-center">
          <div className="flex justify-center py-8 max-h-28">
            <img className="max-h-150px" src={imageSrc} alt="" />
          </div>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._600}
            className="block text-center mb-6"
          >
            {title}
          </OsdsText>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            className="block text-center mb-6"
          >
            {description}
          </OsdsText>
          <div className="flex mb-9 sm:py-8 xs:w-full xs:flex-col xs:space-y-4 sm:items-center sm:w-fit sm:flex-row sm:space-x-4 sm:space-y-0">
            {primaryButtonLabel && (primaryHref || primaryOnClick) && (
              <OsdsButton
                inline
                disabled={primaryButtonDisabled}
                color={ODS_THEME_COLOR_INTENT.primary}
                size={primaryButtonSize}
                href={primaryHref}
                data-tracking={primaryButtonDataTracking}
                {...(primaryOnClick ? handleClick(primaryOnClick) : {})}
              >
                {primaryButtonLabel}
              </OsdsButton>
            )}
            {secondaryButtonLabel && (secondaryHref || secondaryOnClick) && (
              <OsdsButton
                inline
                disabled={secondaryButtonDisabled}
                color={ODS_THEME_COLOR_INTENT.primary}
                variant={ODS_BUTTON_VARIANT.stroked}
                size={secondaryButtonSize}
                href={secondaryHref}
                data-tracking={secondaryButtonDataTracking}
                {...(secondaryOnClick ? handleClick(secondaryOnClick) : {})}
              >
                {secondaryButtonLabel}
                <span slot={secondaryButtonIconPosition}>
                  <OsdsIcon
                    name={secondaryButtonIcon}
                    size={ODS_ICON_SIZE.xs}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                </span>
              </OsdsButton>
            )}
          </div>
        </section>
        {children}
      </div>
    </PageLayout>
  );
};
