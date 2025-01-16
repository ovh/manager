import React from 'react';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

type FormLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  submitLabel: string;
  isSubmitDisabled?: boolean;
  onClickSubmit: () => void;
  onClickPrevious?: () => void;
};

export default function FormLayout({
  children,
  title,
  subtitle,
  submitLabel,
  isSubmitDisabled,
  onClickSubmit,
  onClickPrevious,
}: Readonly<FormLayoutProps>) {
  const { t } = useTranslation('installation');

  return (
    <form className="flex flex-col gap-y-6">
      <OdsText preset="heading-2">{title}</OdsText>
      {subtitle && <OdsText>{subtitle}</OdsText>}
      {children}
      <div className="flex gap-x-2">
        {onClickPrevious && (
          <OdsButton
            label={t('previous_step_cta')}
            variant="outline"
            onClick={onClickPrevious}
          />
        )}
        <OdsButton
          label={submitLabel}
          isDisabled={isSubmitDisabled}
          onClick={onClickSubmit}
        />
      </div>
    </form>
  );
}
