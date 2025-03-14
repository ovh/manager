import {
  ODS_CARD_COLOR,
  ODS_DIVIDER_COLOR,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsCard,
  OdsDivider,
  OdsIcon,
  OdsMessage,
  OdsSpinner,
  OdsText,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import React, { useMemo, useRef } from 'react';
import { getI18n, useTranslation } from 'react-i18next';
import * as dateFnsLocales from 'date-fns/locale';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { format, parseISO } from 'date-fns';
import { TrackingEnum } from '@/enum/tracking.enum';
import { TTracking } from '@/types';

interface TrackingCardProps {
  readonly tracking: TTracking;
}

export default function TrackingCard({ tracking }: TrackingCardProps) {
  const { t } = useTranslation('dashboard');
  const l = getI18n();
  const locales = useRef({ ...dateFnsLocales }).current;
  const userLocale = getDateFnsLocale(l.language);
  const lastUpdateDate = useMemo(
    () =>
      tracking?.lastUpdateDate &&
      format(parseISO(tracking.lastUpdateDate), 'P', {
        locale: locales[userLocale as keyof typeof locales],
      }),
    [tracking],
  );

  return (
    <OdsCard color={ODS_CARD_COLOR.neutral} className="w-3/4 mb-4">
      <div className="px-3 py-3">
        <div className="pl-4 flex items-center gap-x-2">
          {[TrackingEnum.Initialisation, TrackingEnum.AskForAuthInfo].includes(
            tracking.currentStep.step,
          ) && <OdsSpinner data-testid="init-spinner" size="xs" />}
          {tracking.progress > 0 && (
            <OdsIcon
              data-testid="init-check"
              name="circle-check"
              className="success"
            />
          )}
          <OdsText preset="heading-4">
            {t('tracking_transfert_first_step_operation_title')}
          </OdsText>
        </div>
        {tracking.currentStep.step === TrackingEnum.Initialisation && (
          <div className="pl-5 mt-1" data-testid="init-section">
            <div>
              <OdsText preset={ODS_TEXT_PRESET.span}>
                {t('tracking_transfert_first_step_operation_create')}
              </OdsText>
              <OdsText preset={ODS_TEXT_PRESET.paragraph} className="block">
                {t('tracking_transfert_first_step_operation_steps')}
              </OdsText>
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t('tracking_transfert_last_update', {
                  t0: lastUpdateDate,
                })}
              </OdsText>
            </div>
          </div>
        )}
        {tracking.currentStep.step === TrackingEnum.AskForAuthInfo && (
          <div className="pl-5 mt-1" data-testid="auth-error">
            <OdsMessage
              color={ODS_MESSAGE_COLOR.warning}
              isDismissible={false}
              className="w-full"
            >
              <OdsText preset={ODS_TEXT_PRESET.heading6} className="block">
                {t('domain_operations_progress_step_askForAuthInfo')}
              </OdsText>
            </OdsMessage>
          </div>
        )}
      </div>
      <OdsDivider color={ODS_DIVIDER_COLOR.light} />
      <div className="px-3 py-3">
        <div className="pl-4 flex items-center gap-x-2">
          {tracking.currentStep.step === TrackingEnum.ContactConfirmation && (
            <OdsSpinner data-testid="contact-spinner" size="xs" />
          )}
          {tracking.progress > 25 && (
            <OdsIcon
              data-testid="contact-check"
              name="circle-check"
              className="success"
            />
          )}
          <OdsText
            preset={ODS_TEXT_PRESET.heading4}
            className={
              tracking.progress >= 25 ? 'primary-title' : 'disabled-title'
            }
          >
            {t('tracking_transfert_second_step_title')}
          </OdsText>
        </div>
        {tracking.currentStep.step === TrackingEnum.ContactConfirmation && (
          <div
            className="pl-5 mt-1 flex flex-col gap-y-2"
            data-testid="contact-section"
          >
            <OdsText preset={ODS_TEXT_PRESET.span}>
              {t('tracking_transfert_second_step_info')}
            </OdsText>
            <OdsMessage isDismissible={false}>
              <div>
                <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                  {t('tracking_transfert_second_step_mail')}
                </OdsText>
                <OdsText preset={ODS_TEXT_PRESET.span}>
                  {t('tracking_transfert_second_step_validate')}
                </OdsText>
              </div>
            </OdsMessage>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('tracking_transfert_last_update', {
                t0: lastUpdateDate,
              })}
            </OdsText>
          </div>
        )}
      </div>
      <OdsDivider color={ODS_DIVIDER_COLOR.light} />
      <div className="px-3 py-3">
        <div className="pl-4 flex items-center gap-x-2">
          {tracking.currentStep.step ===
            TrackingEnum.CurrentRegistrarConfirmation && (
            <OdsSpinner data-testid="confirmation-spinner" size="xs" />
          )}
          {tracking.progress > 50 && (
            <OdsIcon
              data-testid="confirmation-check"
              name="circle-check"
              className="success"
            />
          )}
          <OdsText
            preset={ODS_TEXT_PRESET.heading4}
            className={
              tracking.progress >= 50 ? 'primary-title' : 'disabled-title'
            }
          >
            {t('tracking_transfert_third_step_operation_title')}
          </OdsText>
        </div>
        {tracking.currentStep.step ===
          TrackingEnum.CurrentRegistrarConfirmation && (
          <div
            className="pl-5 mt-1 flex flex-col gap-y-2"
            data-testid="confirmation-section"
          >
            <OdsText preset={ODS_TEXT_PRESET.span}>
              {t('tracking_transfert_third_step_operation_info')}
            </OdsText>
            <OdsText preset={ODS_TEXT_PRESET.paragraph} className="block">
              {t('tracking_transfert_last_update', {
                t0: lastUpdateDate,
              })}
            </OdsText>
          </div>
        )}
      </div>
      <OdsDivider color={ODS_DIVIDER_COLOR.light} />
      <div className="px-3 py-3">
        <div className="pl-4 flex items-center gap-x-2">
          {tracking.currentStep.step === TrackingEnum.Finalization && (
            <OdsSpinner data-testid="finalization-spinner" size="xs" />
          )}
          <OdsText
            preset={ODS_TEXT_PRESET.heading4}
            className={
              tracking.progress >= 75 ? 'primary-title' : 'disabled-title'
            }
          >
            {t('tracking_transfert_fourth_step_operation_title')}
          </OdsText>
        </div>
        {tracking?.currentStep.step === TrackingEnum.Finalization && (
          <div
            className="pl-5 mt-1 flex flex-col gap-y-2"
            data-testid="finalization-section"
          >
            <OdsText preset={ODS_TEXT_PRESET.span}>
              {t('tracking_transfert_fourth_step_operation_info')}
            </OdsText>
            <ul className="pl-4 my-0 text-[--ods-color-text]">
              <li>{t('tracking_transfert_fourth_step_operation_list_1')}</li>
              <li>
                {t('tracking_transfert_fourth_step_operation_list_2')}
                <OdsIcon
                  id="trigger-1"
                  name="circle-question"
                  className="ml-1"
                />
                <OdsTooltip
                  role="tooltip"
                  strategy="fixed"
                  triggerId="trigger-1"
                >
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    {t(
                      'tracking_transfert_fourth_step_operation_list_2_detail',
                    )}
                  </OdsText>
                </OdsTooltip>
              </li>
            </ul>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('tracking_transfert_last_update', {
                t0: lastUpdateDate,
              })}
            </OdsText>
          </div>
        )}
      </div>
    </OdsCard>
  );
}
