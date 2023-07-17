import React from 'react';
import { OsdsButton, OsdsText } from '@ovhcloud/ods-stencil/components/react';
import {
  OdsThemeColorIntent,
  OdsThemeTypographyLevel,
  OdsThemeTypographySize,
} from '@ovhcloud/ods-theming';
import { OdsButtonSize, OdsButtonVariant } from '@ovhcloud/ods-core';
import placeholderSrc from './placeholder.png';
import './OnboardingLayout.scss';

export type OnboardingLayoutProps = {
  hideHeadingSection?: boolean;
  imageSrc?: string;
  title: string;
  orderButtonLabel: string;
  orderHref: string;
  description?: string;
  moreInfoHref?: string;
  moreInfoButtonLabel?: string;
  children: React.ReactNode;
};

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  hideHeadingSection,
  imageSrc,
  title,
  description,
  orderHref,
  orderButtonLabel,
  moreInfoHref,
  moreInfoButtonLabel,
  children,
}) => {
  return (
    <div className="manager-on-boarding-layout px-3">
      {!hideHeadingSection && (
        <section className="on-boarding-illustration-section">
          <div className="on-boarding-illustration-container py-3">
            <img src={imageSrc || placeholderSrc} alt="" />
          </div>
          <OsdsText
            className="on-boarding-title mb-3"
            color={OdsThemeColorIntent.primary}
            level={OdsThemeTypographyLevel.heading}
            size={OdsThemeTypographySize._700}
          >
            {title}
          </OsdsText>
          <OsdsText
            className="on-boarding-description mb-2"
            level={OdsThemeTypographyLevel.body}
          >
            {description}
          </OsdsText>
          <div>
            <span>
              <OsdsButton
                color={OdsThemeColorIntent.primary}
                size={OdsButtonSize.md}
                href={orderHref}
              >
                {orderButtonLabel}
              </OsdsButton>
            </span>
            {moreInfoButtonLabel && moreInfoHref && (
              <span className="m-2">
                <OsdsButton
                  className="more-info-button ml-1"
                  color={OdsThemeColorIntent.primary}
                  variant={OdsButtonVariant.stroked}
                  size={OdsButtonSize.md}
                  href={moreInfoHref}
                >
                  {moreInfoButtonLabel}
                </OsdsButton>
              </span>
            )}
          </div>
        </section>
      )}
      {children}
    </div>
  );
};
