import React from 'react';
import { OsdsButton, OsdsText } from '@ovhcloud/ods-stencil/components/react';
import {
  OdsThemeColorIntent,
  OdsThemeTypographyLevel,
  OdsThemeTypographySize,
} from '@ovhcloud/ods-theming';
import { OdsButtonSize } from '@ovhcloud/ods-core';
import placeholderSrc from './placeholder.png';
import './OnboardingLayout.scss';

export type OnboardingLayoutProps = {
  hideHeadingSection?: boolean;
  imageSrc?: string;
  title: string;
  orderButtonLabel: string;
  description?: string;
  orderHref: string;
  children: React.ReactNode;
};

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  hideHeadingSection,
  imageSrc,
  title,
  description,
  orderHref,
  orderButtonLabel,
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
          <OsdsButton
            color={OdsThemeColorIntent.primary}
            size={OdsButtonSize.md}
            href={orderHref}
          >
            {orderButtonLabel}
          </OsdsButton>
        </section>
      )}
      {children}
    </div>
  );
};
