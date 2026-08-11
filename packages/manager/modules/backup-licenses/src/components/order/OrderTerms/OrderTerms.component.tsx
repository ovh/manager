import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_VARIANT, ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCheckbox,
  OdsMessage,
  OdsSkeleton,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { Contract } from '@ovh-ux/manager-module-order';
import { LinkType, Links } from '@ovh-ux/manager-react-components';

import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';

export const ORDER_TERMS_ERROR_TEST_ID = 'order-terms-error';
export const ORDER_TERMS_ACCEPT_ID = 'order-terms-accept';

interface OrderTermsProps {
  contractList: Contract[];
  hasRegion: boolean;
  isPreparing: boolean;
  hasFailed: boolean;
  isAccepted: boolean;
  isDisabled?: boolean;
  onAcceptChange: (accepted: boolean) => void;
  onRetry: () => void;
}

export default function OrderTerms({
  contractList,
  hasRegion,
  isPreparing,
  hasFailed,
  isAccepted,
  isDisabled = false,
  onAcceptChange,
  onRetry,
}: OrderTermsProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);

  const renderContent = () => {
    if (!hasRegion) {
      return (
        <OdsText
          preset={ODS_TEXT_PRESET.caption}
          className="block [--ods-color-text:var(--ods-color-neutral-600)]"
        >
          {t('terms.placeholder')}
        </OdsText>
      );
    }

    if (isPreparing) {
      return (
        <div className="flex flex-col gap-2">
          <OdsText
            preset={ODS_TEXT_PRESET.caption}
            className="block [--ods-color-text:var(--ods-color-neutral-600)]"
          >
            {t('terms.loading')}
          </OdsText>
          <OdsSkeleton className="w-full" />
          <OdsSkeleton className="w-3/5" />
        </div>
      );
    }

    if (hasFailed) {
      return (
        <OdsMessage
          color={ODS_MESSAGE_COLOR.critical}
          isDismissible={false}
          data-testid={ORDER_TERMS_ERROR_TEST_ID}
        >
          <div className="flex w-full items-center justify-between gap-4">
            <span>{t('terms.error')}</span>
            <OdsButton
              type="button"
              variant={ODS_BUTTON_VARIANT.outline}
              label={t('terms.retry')}
              isDisabled={isDisabled}
              onClick={onRetry}
            />
          </div>
        </OdsMessage>
      );
    }

    return (
      <div className="flex flex-col gap-5">
        <ul className="flex list-disc flex-col gap-2 pl-5">
          {contractList.map((contract) => (
            <li key={contract.name}>
              <Links
                href={contract.url}
                target="_blank"
                type={LinkType.external}
                label={contract.name}
              />
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <OdsCheckbox
            name={ORDER_TERMS_ACCEPT_ID}
            inputId={ORDER_TERMS_ACCEPT_ID}
            isChecked={isAccepted}
            isDisabled={isDisabled}
            onOdsChange={(event) => onAcceptChange(!!event.detail.checked)}
          />
          <label className="cursor-pointer" htmlFor={ORDER_TERMS_ACCEPT_ID}>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t('terms.accept_label')}</OdsText>
          </label>
        </div>
      </div>
    );
  };

  return (
    <section aria-label={t('terms.section_title')}>
      <OdsText preset={ODS_TEXT_PRESET.heading5} className="mb-6 block">
        {t('terms.section_title')}
      </OdsText>
      <div aria-live="polite" aria-busy={isPreparing}>
        {renderContent()}
      </div>
    </section>
  );
}
