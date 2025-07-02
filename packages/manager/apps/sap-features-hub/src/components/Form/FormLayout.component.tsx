import React from 'react';
import { OdsButton, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { testIds } from '@/utils/testIds.constants';

export type FormLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string | React.ReactNode;
  submitLabel: string;
  isSubmitDisabled?: boolean;
  isSubmitLoading?: boolean;
  serverErrorMessage?: string;
  onPrevious?: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, 'className'>;

export default function FormLayout({
  children,
  title,
  subtitle,
  submitLabel,
  isSubmitDisabled,
  isSubmitLoading,
  serverErrorMessage,
  onPrevious,
  onSubmit,
  ...rest
}: Readonly<FormLayoutProps>) {
  const { t } = useTranslation('installation');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSubmitDisabled) onSubmit(e);
  };

  return (
    <form className="flex flex-col gap-y-6" onSubmit={handleSubmit} {...rest}>
      <div className="flex flex-col gap-y-4 max-w-5xl">
        <OdsText preset="heading-2">{title}</OdsText>
        {subtitle && <OdsText>{subtitle}</OdsText>}
        {serverErrorMessage && (
          <OdsMessage color="critical">
            {t('installation_error_server_message', {
              error: serverErrorMessage,
            })}
          </OdsMessage>
        )}
        {children}
      </div>
      <div className="flex gap-x-2">
        {onPrevious && (
          <OdsButton
            label={t('previous_step_cta')}
            variant="outline"
            onClick={onPrevious}
            data-testid={testIds.formPreviousCta}
          />
        )}
        <OdsButton
          label={submitLabel}
          isDisabled={isSubmitDisabled}
          isLoading={isSubmitLoading}
          type="submit"
          variant="default"
          data-testid={testIds.formSubmitCta}
        />
      </div>
    </form>
  );
}
