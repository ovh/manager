import React from 'react';
import {
  OsdsButton,
  OsdsDivider,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_DIVIDER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import placeholderSrc from './placeholder.png';

export type OnboardingLayoutProps = {
  hideHeadingSection?: boolean;
  imageSrc?: string;
  title: string;
  orderButtonLabel: string;
  onOrderButtonClick: () => void;
  description?: string;
  moreInfoHref?: string;
  moreInfoButtonLabel?: string;
};

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  hideHeadingSection,
  imageSrc,
  title,
  description,
  onOrderButtonClick,
  orderButtonLabel,
}) => {
  return (
    <div className="flex flex-col mx-auto px-3 max-w-3xl">
      {!hideHeadingSection && (
        <section className="flex flex-col items-center">
          <div className="flex justify-center py-3 max-h-14">
            <img
              src={imageSrc || placeholderSrc}
              alt=""
              width={500}
              height={300}
            />
          </div>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.primary}
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._700}
            className="block text-center mb-3"
          >
            {title}
          </OsdsText>
          <OsdsDivider size={ODS_DIVIDER_SIZE.seven} />
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._100}
            className="block text-center mb-2  max-w-5xl"
          >
            {description}
          </OsdsText>
          <div className="flex sm:py-8 xs:w-full xs:flex-col sm:items-center sm:w-fit sm:flex-row">
            <div className="w-full xs:py-3">
              <OsdsButton
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_BUTTON_SIZE.md}
                onClick={onOrderButtonClick}
              >
                {orderButtonLabel}
              </OsdsButton>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
