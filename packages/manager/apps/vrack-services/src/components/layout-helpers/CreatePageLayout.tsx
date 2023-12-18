import React from 'react';
import { OsdsMessage } from '@ovhcloud/ods-components/message/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components/message';
import { OsdsLink } from '@ovhcloud/ods-components/link/react';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { useNavigate } from 'react-router-dom';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_TYPE,
} from '@ovhcloud/ods-components/button';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components/spinner';
import { OsdsSpinner } from '@ovhcloud/ods-components/spinner/react';
import { PageLayout } from '@/components/layout-helpers/PageLayout';
import { handleClick } from '@/utils/ods-utils';

export type CreatePageLayoutProps = React.PropsWithChildren<{
  goBackUrl: string;
  goBackLinkLabel: string;
  title: string;
  onSubmit: React.FormEventHandler;
  isFormSubmittable?: boolean;
  isSubmitPending?: boolean;
  hasFormError?: boolean;
  formErrorMessage: string;
  createButtonLabel: string;
}>;

export const CreatePageLayout: React.FC<CreatePageLayoutProps> = ({
  goBackUrl,
  goBackLinkLabel,
  title,
  onSubmit,
  isFormSubmittable,
  isSubmitPending,
  hasFormError,
  formErrorMessage,
  createButtonLabel,
  children,
}) => {
  const navigate = useNavigate();
  return (
    <PageLayout>
      <OsdsLink
        className="block mt-4 mb-5"
        color={ODS_THEME_COLOR_INTENT.primary}
        {...handleClick(() => navigate(goBackUrl, { replace: true }))}
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
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._600}
        className="block mb-7"
      >
        {title}
      </OsdsText>
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
