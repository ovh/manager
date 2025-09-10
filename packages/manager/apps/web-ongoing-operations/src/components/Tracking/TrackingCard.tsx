import React from 'react';
import {
  Card,
  CARD_COLOR,
  Divider,
  DIVIDER_COLOR,
  Icon,
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
  Spinner,
  Text,
  TEXT_PRESET,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { useFormatDate } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { TrackingEnum } from '@/enum/tracking.enum';
import { TTracking } from '@/types';

interface TrackingCardProps {
  readonly tracking: TTracking;
}

export default function TrackingCard({ tracking }: TrackingCardProps) {
  const { t } = useTranslation('dashboard');
  const formatDate = useFormatDate();

  return (
    <Card color={CARD_COLOR.neutral} className="w-3/4 mb-4">
      <div className="px-3 py-3">
        <div className="pl-4 flex items-center gap-x-2">
          {[TrackingEnum.Initialisation, TrackingEnum.AskForAuthInfo].includes(
            tracking.currentStep.step,
          ) && (
            <Spinner data-testid="init-spinner" className="flex" size="xs" />
          )}
          {tracking.progress > 0 && (
            <Icon
              data-testid="init-check"
              name="circle-check"
              className="text-[var(--ods-color-success-500)]"
            />
          )}
          <Text preset="heading-4">
            {t('tracking_transfert_first_step_operation_title')}
          </Text>
        </div>
        {tracking.currentStep.step === TrackingEnum.Initialisation && (
          <div className="pl-5 mt-1" data-testid="init-section">
            <div>
              <Text preset={TEXT_PRESET.span}>
                {t('tracking_transfert_first_step_operation_create')}
              </Text>
              <Text preset={TEXT_PRESET.paragraph} className="block">
                {t('tracking_transfert_first_step_operation_steps')}
              </Text>
              <Text preset={TEXT_PRESET.paragraph}>
                {t('tracking_transfert_last_update', {
                  t0: formatDate({
                    date: tracking.lastUpdateDate,
                    format: 'P',
                  }),
                })}
              </Text>
            </div>
          </div>
        )}
        {tracking.currentStep.step === TrackingEnum.AskForAuthInfo && (
          <div className="pl-5 mt-1" data-testid="auth-error">
            <Message
              color={MESSAGE_COLOR.warning}
              dismissible={false}
              className="w-full"
            >
              <MessageIcon name={ICON_NAME.diamondExclamation} />
              <MessageBody>
                <Text preset={TEXT_PRESET.heading6} className="block">
                  {t('domain_operations_progress_step_askForAuthInfo')}
                </Text>
              </MessageBody>
            </Message>
          </div>
        )}
      </div>
      <Divider color={DIVIDER_COLOR.primary} />
      <div className="px-3 py-3">
        <div className="pl-4 flex items-center gap-x-2">
          {tracking.currentStep.step === TrackingEnum.ContactConfirmation && (
            <Spinner data-testid="contact-spinner" className="flex" size="xs" />
          )}
          {tracking.progress > 25 && (
            <Icon
              data-testid="contact-check"
              name="circle-check"
              className="text-[var(--ods-color-success-500)]"
            />
          )}
          <Text
            preset={TEXT_PRESET.heading4}
            className={
              tracking.progress >= 25 ? 'primary-title' : 'disabled-title'
            }
          >
            {t('tracking_transfert_second_step_title')}
          </Text>
        </div>
        {tracking.currentStep.step === TrackingEnum.ContactConfirmation && (
          <div
            className="pl-5 mt-1 flex flex-col gap-y-2"
            data-testid="contact-section"
          >
            <Text preset={TEXT_PRESET.span}>
              {t('tracking_transfert_second_step_info')}
            </Text>
            <Message dismissible={false}>
              <MessageIcon name={ICON_NAME.diamondExclamation} />
              <MessageBody>
                <Text preset={TEXT_PRESET.paragraph}>
                  {t('tracking_transfert_second_step_mail')}
                </Text>
                <Text preset={TEXT_PRESET.span}>
                  {t('tracking_transfert_second_step_validate')}
                </Text>
              </MessageBody>
            </Message>
            <Text preset={TEXT_PRESET.paragraph}>
              {t('tracking_transfert_last_update', {
                t0: formatDate({
                  date: tracking.lastUpdateDate,
                  format: 'P',
                }),
              })}
            </Text>
          </div>
        )}
      </div>
      <Divider color={DIVIDER_COLOR.primary} />
      <div className="px-3 py-3">
        <div className="pl-4 flex items-center gap-x-2">
          {tracking.currentStep.step ===
            TrackingEnum.CurrentRegistrarConfirmation && (
            <Spinner
              data-testid="confirmation-spinner"
              className="flex"
              size="xs"
            />
          )}
          {tracking.progress > 50 && (
            <Icon
              data-testid="confirmation-check"
              name="circle-check"
              className="text-[var(--ods-color-success-500)]"
            />
          )}
          <Text
            preset={TEXT_PRESET.heading4}
            className={
              tracking.progress >= 50 ? 'primary-title' : 'disabled-title'
            }
          >
            {t('tracking_transfert_third_step_operation_title')}
          </Text>
        </div>
        {tracking.currentStep.step ===
          TrackingEnum.CurrentRegistrarConfirmation && (
          <div
            className="pl-5 mt-1 flex flex-col gap-y-2"
            data-testid="confirmation-section"
          >
            <Text preset={TEXT_PRESET.span}>
              {t('tracking_transfert_third_step_operation_info')}
            </Text>
            <Text preset={TEXT_PRESET.paragraph} className="block">
              {t('tracking_transfert_last_update', {
                t0: formatDate({
                  date: tracking.lastUpdateDate,
                  format: 'P',
                }),
              })}
            </Text>
          </div>
        )}
      </div>
      <Divider color={DIVIDER_COLOR.primary} />
      <div className="px-3 py-3">
        <div className="pl-4 flex items-center gap-x-2">
          {tracking.currentStep.step === TrackingEnum.Finalization && (
            <Spinner
              data-testid="finalization-spinner"
              className="flex"
              size="xs"
            />
          )}
          <Text
            preset={TEXT_PRESET.heading4}
            className={
              tracking.progress >= 75 ? 'primary-title' : 'disabled-title'
            }
          >
            {t('tracking_transfert_fourth_step_operation_title')}
          </Text>
        </div>
        {tracking?.currentStep.step === TrackingEnum.Finalization && (
          <div
            className="pl-5 mt-1 flex flex-col gap-y-2"
            data-testid="finalization-section"
          >
            <Text preset={TEXT_PRESET.span}>
              {t('tracking_transfert_fourth_step_operation_info')}
            </Text>
            <ul className="pl-4 my-0 text-[--ods-color-text]">
              <li>{t('tracking_transfert_fourth_step_operation_list_1')}</li>
              <li>
                {t('tracking_transfert_fourth_step_operation_list_2')}

                <Tooltip>
                  <TooltipTrigger>
                    <Icon
                      id="trigger-1"
                      name="circle-question"
                      className="ml-1"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <Text preset={TEXT_PRESET.span}>
                      {t(
                        'tracking_transfert_fourth_step_operation_list_2_detail',
                      )}
                    </Text>
                  </TooltipContent>
                </Tooltip>
              </li>
            </ul>
            <Text preset={TEXT_PRESET.paragraph}>
              {t('tracking_transfert_last_update', {
                t0: formatDate({
                  date: tracking.lastUpdateDate,
                  format: 'P',
                }),
              })}
            </Text>
          </div>
        )}
      </div>
    </Card>
  );
}
