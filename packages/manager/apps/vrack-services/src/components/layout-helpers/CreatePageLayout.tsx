import React from 'react';
import {
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
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
} from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { handleClick } from '@ovhcloud/manager-components';
import { PageLayout } from '@/components/layout-helpers/PageLayout';
import { LoadingText } from '../LoadingText';

export type CreatePageLayoutProps = React.PropsWithChildren<{
  overviewUrl?: string;
  goBackUrl?: string;
  goBackLinkLabel?: string;
  confirmActionsTracking?: string[];
  title: string;
  description?: string;
  onSubmit: React.FormEventHandler;
  isFormSubmittable?: boolean;
  isSubmitPending?: boolean;
  hasFormError?: boolean;
  formErrorMessage?: string;
  createButtonLabel: string;
  loadingText?: string;
  loadingDescription?: string;
}>;

export const CreatePageLayout: React.FC<CreatePageLayoutProps> = ({
  overviewUrl,
  goBackUrl,
  goBackLinkLabel,
  title,
  description,
  onSubmit,
  isFormSubmittable,
  isSubmitPending,
  hasFormError,
  formErrorMessage,
  createButtonLabel,
  children,
  confirmActionsTracking = ['confirm'],
  loadingText,
  loadingDescription,
}) => {
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  return (
    <PageLayout items={[{ label: title }]} overviewUrl={overviewUrl}>
      {goBackUrl && goBackLinkLabel && (
        <OsdsLink
          className="block mt-4 mb-5"
          color={ODS_THEME_COLOR_INTENT.primary}
          {...handleClick(() => {
            trackClick({
              location: PageLocation.funnel,
              buttonType: ButtonType.link,
              actions: ['go-back'],
            });
            navigate(goBackUrl);
          })}
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
          {...handleClick(() => {
            trackClick({
              location: PageLocation.funnel,
              buttonType: ButtonType.button,
              actions: confirmActionsTracking,
            });
          })}
        >
          {createButtonLabel}
        </OsdsButton>
      </form>
      {isSubmitPending && (
        <div className="mt-4">
          <LoadingText title={loadingText} description={loadingDescription} />
        </div>
      )}
      {hasFormError && (
        <OsdsMessage className="mt-5" type={ODS_MESSAGE_TYPE.error}>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {formErrorMessage}
          </OsdsText>
        </OsdsMessage>
      )}
    </PageLayout>
  );
};
