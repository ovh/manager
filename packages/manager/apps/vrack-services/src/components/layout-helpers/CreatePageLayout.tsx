import React from 'react';
import {
  OsdsSpinner,
  OsdsIcon,
  OsdsText,
  OsdsButton,
  OsdsLink,
  OsdsMessage,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_SPINNER_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
} from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { PageLayout } from '@/components/layout-helpers/PageLayout';
import { handleClick } from '@/utils/ods-utils';

export type CreatePageLayoutProps = React.PropsWithChildren<{
  overviewUrl?: string;
  goBackUrl?: string;
  goBackLinkLabel?: string;
  goBackLinkDataTracking?: string;
  title: string;
  description?: string;
  onSubmit: React.FormEventHandler;
  isFormSubmittable?: boolean;
  isSubmitPending?: boolean;
  hasFormError?: boolean;
  formErrorMessage?: string;
  createButtonLabel: string;
  createButtonDataTracking?: string;
}>;

export const CreatePageLayout: React.FC<CreatePageLayoutProps> = ({
  overviewUrl,
  goBackUrl,
  goBackLinkLabel,
  goBackLinkDataTracking,
  title,
  description,
  onSubmit,
  isFormSubmittable,
  isSubmitPending,
  hasFormError,
  formErrorMessage,
  createButtonLabel,
  createButtonDataTracking,
  children,
}) => {
  const navigate = useNavigate();
  return (
    <PageLayout items={[{ label: title }]} overviewUrl={overviewUrl}>
      {goBackUrl && goBackLinkLabel && (
        <OsdsLink
          className="block mt-4 mb-5"
          color={ODS_THEME_COLOR_INTENT.primary}
          data-tracking={goBackLinkDataTracking}
          {...handleClick(() => navigate(goBackUrl))}
        >
          <span slot="start">
            <OsdsIcon
              className="mr-4"
              name={ODS_ICON_NAME.ARROW_LEFT}
              size={ODS_ICON_SIZE.xs}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </span>
          {goBackLinkLabel}
        </OsdsLink>
      )}
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._600}
        className="block mb-7"
      >
        {title}
      </OsdsText>
      {description && (
        <OsdsText
          className="block mb-8"
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.default}
          size={ODS_TEXT_SIZE._400}
        >
          {description}
        </OsdsText>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(event);
        }}
      >
        {children}
        <OsdsButton
          disabled={!isFormSubmittable || isSubmitPending || undefined}
          inline
          type={ODS_BUTTON_TYPE.submit}
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.flat}
          size={ODS_BUTTON_SIZE.sm}
          data-tracking={createButtonDataTracking}
        >
          {createButtonLabel}
        </OsdsButton>
      </form>
      {isSubmitPending && (
        <div className="mt-4">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      )}
      {hasFormError && (
        <OsdsMessage className="mt-5" type={ODS_MESSAGE_TYPE.error}>
          {formErrorMessage}
        </OsdsMessage>
      )}
    </PageLayout>
  );
};
