import React from 'react';
import { OdsText, OdsButton, OdsMessage } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_TEXT_PRESET,
  ODS_MESSAGE_COLOR,
} from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { LinkType, Links, PageLayout } from '@ovh-ux/manager-react-components';
import { LoadingText } from '../LoadingText.component';
import { Breadcrumb } from '../Breadcrumb.component';

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
    <PageLayout>
      <Breadcrumb items={[{ label: title }]} overviewUrl={overviewUrl} />
      {goBackUrl && goBackLinkLabel && (
        <Links
          type={LinkType.back}
          label={goBackLinkLabel}
          onClickReturn={() => {
            trackClick({
              location: PageLocation.funnel,
              buttonType: ButtonType.link,
              actions: ['go-back'],
            });
            navigate(goBackUrl);
          }}
        />
      )}
      <OdsText preset={ODS_TEXT_PRESET.heading2} className="block mb-7">
        {title}
      </OdsText>
      {description && (
        <OdsText className="block mb-8" preset={ODS_TEXT_PRESET.paragraph}>
          {description}
        </OdsText>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(event);
        }}
      >
        {children}
        <OdsButton
          isDisabled={!isFormSubmittable || isSubmitPending}
          type="submit"
          size={ODS_BUTTON_SIZE.sm}
          label={createButtonLabel}
          onClick={() => {
            trackClick({
              location: PageLocation.funnel,
              buttonType: ButtonType.button,
              actions: confirmActionsTracking,
            });
          }}
        />
      </form>
      {isSubmitPending && (
        <div className="mt-4">
          <LoadingText title={loadingText} description={loadingDescription} />
        </div>
      )}
      {hasFormError && (
        <OdsMessage
          isDismissible={false}
          className="block mt-5"
          color={ODS_MESSAGE_COLOR.critical}
        >
          {formErrorMessage}
        </OdsMessage>
      )}
    </PageLayout>
  );
};
