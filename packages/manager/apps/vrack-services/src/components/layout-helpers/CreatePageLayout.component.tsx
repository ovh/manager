import React from 'react';
import {
  BUTTON_SIZE,
  TEXT_PRESET,
  MESSAGE_COLOR,
  Text,
  Button,
  Message,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';
import { useNavigate } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { LinkType, Link, BaseLayout } from '@ovh-ux/muk';
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
    <BaseLayout>
      <Breadcrumb items={[{ label: title }]} overviewUrl={overviewUrl} />
      {goBackUrl && goBackLinkLabel && (
        <Link
          type={LinkType.back}
          label={goBackLinkLabel}
          onClick={() => {
            trackClick({
              location: PageLocation.funnel,
              buttonType: ButtonType.link,
              actions: ['go-back'],
            });
            navigate(goBackUrl);
          }}
        />
      )}
      <Text preset={TEXT_PRESET.heading2} className="block mb-7">
        {title}
      </Text>
      {description && (
        <Text className="block mb-8" preset={TEXT_PRESET.paragraph}>
          {description}
        </Text>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(event);
        }}
      >
        {children}
        <Button
          disabled={!isFormSubmittable || isSubmitPending}
          type="submit"
          size={BUTTON_SIZE.sm}
          onClick={() => {
            trackClick({
              location: PageLocation.funnel,
              buttonType: ButtonType.button,
              actions: confirmActionsTracking,
            });
          }}
        >
          {createButtonLabel}
        </Button>
      </form>
      {isSubmitPending && (
        <div className="mt-4">
          <LoadingText title={loadingText} description={loadingDescription} />
        </div>
      )}
      {hasFormError && (
        <Message
          dismissible={false}
          className="mt-5"
          color={MESSAGE_COLOR.critical}
        >
          <MessageIcon name="hexagon-exclamation" />
          <MessageBody>{formErrorMessage}</MessageBody>
        </Message>
      )}
    </BaseLayout>
  );
};
