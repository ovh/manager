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
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, 'className'>;

export default function FormLayout({
  children,
  title,
  subtitle,
  submitLabel,
  isSubmitDisabled,
  onPrevious,
  ...props
}: Readonly<FormLayoutProps>) {
  const { t } = useTranslation('installation');

  return (
    <form className="flex flex-col gap-y-6" {...props}>
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
