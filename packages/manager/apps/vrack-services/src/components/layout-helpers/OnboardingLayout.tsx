import React from 'react';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { PageLayout } from './PageLayout';

export type OnboardingLayoutProps = React.PropsWithChildren<{
  imageSrc?: string;
  introTitle?: string;
  intro?: string;
  title: string;
  orderButtonLabel: string;
  orderHref: string;
  description?: string;
  moreInfoHref?: string;
  moreInfoButtonLabel?: string;
}>;

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  imageSrc,
  introTitle,
  intro,
  title,
  description,
  orderHref,
  orderButtonLabel,
  moreInfoHref,
  moreInfoButtonLabel,
  children,
}) => {
  return (
    <PageLayout>
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
            <OsdsButton
              inline
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_BUTTON_SIZE.md}
              href={orderHref}
            >
              {orderButtonLabel}
            </OsdsButton>
            {moreInfoButtonLabel && moreInfoHref && (
              <OsdsButton
                inline
                color={ODS_THEME_COLOR_INTENT.primary}
                variant={ODS_BUTTON_VARIANT.stroked}
                size={ODS_BUTTON_SIZE.md}
                href={moreInfoHref}
              >
                {moreInfoButtonLabel}
                <OsdsIcon
                  className="ml-4"
                  name={ODS_ICON_NAME.EXTERNAL_LINK}
                  size={ODS_ICON_SIZE.xs}
                  color={ODS_THEME_COLOR_INTENT.primary}
                />
              </OsdsButton>
            )}
          </div>
        </section>
        {children}
      </div>
    </PageLayout>
  );
};
