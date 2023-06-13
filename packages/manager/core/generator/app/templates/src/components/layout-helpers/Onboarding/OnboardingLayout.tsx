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
    <div className="manager-on-boarding-layout">
      {!hideHeadingSection && (
        <section className="on-boarding-illustration-section">
          <div className="on-boarding-illustration-container">
            <img src={imageSrc || placeholderSrc} alt="" />
          </div>
          <OsdsText
            className="on-boarding-title"
            color={OdsThemeColorIntent.primary}
            level={OdsThemeTypographyLevel.heading}
            size={OdsThemeTypographySize._700}
          >
            {title}
          </OsdsText>
          <OsdsText
            className="on-boarding-description"
            level={OdsThemeTypographyLevel.body}
          >
            {description}
          </OsdsText>
          <div>
            <OsdsButton
              color={OdsThemeColorIntent.primary}
              size={OdsButtonSize.md}
              href={orderHref}
            >
              {orderButtonLabel}
            </OsdsButton>
            {moreInfoButtonLabel && moreInfoHref && (
              <OsdsButton
                className="more-info-button"
                color={OdsThemeColorIntent.primary}
                variant={OdsButtonVariant.stroked}
                size={OdsButtonSize.md}
                href={moreInfoHref}
              >
                {moreInfoButtonLabel}
              </OsdsButton>
            )}
          </div>
        </section>
      )}
      {children}
    </div>
  );
};
