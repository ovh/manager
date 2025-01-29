import React from 'react';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

type FormLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  submitLabel: string;
  isSubmitDisabled?: boolean;
  onPrevious?: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, 'className'>;

export default function FormLayout({
  children,
  title,
  subtitle,
  submitLabel,
  isSubmitDisabled,
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
      <div className="flex flex-col gap-y-4">
        <OdsText preset="heading-2">{title}</OdsText>
        {subtitle && <OdsText>{subtitle}</OdsText>}
        {children}
      </div>
      <div className="flex gap-x-2">
        {onPrevious && (
          <OdsButton
            label={t('previous_step_cta')}
            variant="outline"
            onClick={onPrevious}
          />
        )}
        <OdsButton
          label={submitLabel}
          isDisabled={isSubmitDisabled}
          type="submit"
        />
      </div>
    </form>
  );
}
