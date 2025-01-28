import { BaseLayout } from '@ovh-ux/manager-react-components';
import React, { useEffect, useState } from 'react';
import { useTranslation, getI18n } from 'react-i18next';
import {
  OdsButton,
  OdsCard,
  OdsDivider,
  OdsIcon,
  OdsMessage,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ODS_CARD_COLOR,
  ODS_TEXT_PRESET,
  ODS_DIVIDER_COLOR,
  ODS_MESSAGE_COLOR,
} from '@ovhcloud/ods-components';
import { formatDate } from '@/utils/utils';
import { TrackingEnum } from '@/enum/tracking.enum';
import { getOperationTrackingStatus } from '@/data/api/tracking';
import Loading from '@/components/Loading/Loading';
import SubHeader from '@/components/SubHeader/SubHeader';
import { TOngoingOperations } from '@/types';
import { getmeTaskDomainId } from '@/data/api/web-ongoing-operations';
import { urls } from '@/routes/routes.constant';

export default function Track() {
  const { t } = useTranslation('dashboard');
  const { id } = useParams<{ id: string }>();
  const paramId = Number(id);
  const l = getI18n();
  const [transfertFinalised, setTransfertFinalised] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchTransfertTracking = async (routeId: string) => {
    const response = await getOperationTrackingStatus(paramId);
    return response.data;
  };

  const fetchDomainData = async () => {
    const response = await getmeTaskDomainId(paramId);
    return response.data as TOngoingOperations;
  };

  const { data: tracking, isLoading } = useQuery({
    queryKey: ['tracking'],
    queryFn: () => fetchTransfertTracking(id),
  });

  const { data: domain } = useQuery({
    queryKey: ['domain'],
    queryFn: () => fetchDomainData(),
  });

  useEffect(() => {
    if (tracking?.progress === 100) {
      setTransfertFinalised(true);
    }
  }, [tracking?.progress]);

  if (isLoading) {
    return (
      <div data-testid="listing-page-spinner">
        <Loading />
      </div>
    );
  }

  return (
    <BaseLayout
      header={{
        title: t('domain_operations_dashboard_title'),
      }}
    >
      <SubHeader domain={domain} />

      {transfertFinalised ? (
        <div
          className="flex flex-col items-center justify-center mt-16"
          data-testid="done"
        >
          <div className="flex flex-col gap-y-3 items-center justify-center mb-4">
            <OdsIcon name="check" className="success text-2xl mb-4" />
            <OdsText preset={ODS_TEXT_PRESET.heading3}>
              {t('tracking_transfert_finalized')}
            </OdsText>
          </div>
          <OdsText className="mb-8" preset={ODS_TEXT_PRESET.paragraph}>
            {t('tracking_transfert_sub_finalized')}
          </OdsText>
          <OdsButton
            label={t('tracking_transfert_back_to_domain')}
            onClick={() => navigate(urls.domain)}
          />
        </div>
      ) : (
        <div>
          <OdsCard color={ODS_CARD_COLOR.neutral} className="w-3/4 mb-4">
            <div className="px-3 py-3">
              <div className="pl-4 flex items-center gap-x-2">
                {[
                  TrackingEnum.Initialisation,
                  TrackingEnum.AskForAuthInfo,
                ].includes(tracking?.currentStep.step) && (
                  <OdsSpinner data-testid="init-spinner" size="xs" />
                )}
                {tracking?.progress > 0 && (
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
              {tracking?.currentStep.step === TrackingEnum.Initialisation && (
                <div className="pl-5 mt-1" data-testid="init-section">
                  <div>
                    <OdsText preset={ODS_TEXT_PRESET.span}>
                      {t('tracking_transfert_first_step_operation_create')}
                    </OdsText>
                    <OdsText
                      preset={ODS_TEXT_PRESET.paragraph}
                      className="block"
                    >
                      {t('tracking_transfert_first_step_operation_steps')}
                    </OdsText>
                    <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                      {`${t('tracking_transfert_last_update')} ${formatDate(
                        tracking?.lastUpdateDate,
                        l.language,
                      )}`}
                    </OdsText>
                  </div>
                </div>
              )}
              {tracking?.currentStep.step === TrackingEnum.AskForAuthInfo && (
                <div className="pl-5 mt-1" data-testid="auth-error">
                  <OdsMessage
                    color={ODS_MESSAGE_COLOR.warning}
                    isDismissible={false}
                    className="w-full"
                  >
                    <OdsText
                      preset={ODS_TEXT_PRESET.heading6}
                      className="block"
                    >
                      {t('domain_operations_progress_step_askForAuthInfo')}
                    </OdsText>
                  </OdsMessage>
                </div>
              )}
            </div>
            <OdsDivider color={ODS_DIVIDER_COLOR.light} />
            <div className="px-3 py-3">
              <div className="pl-4 flex items-center gap-x-2">
                {tracking?.currentStep.step ===
                  TrackingEnum.ContactConfirmation && (
                  <OdsSpinner data-testid="contact-spinner" size="xs" />
                )}
                {tracking?.progress > 25 && (
                  <OdsIcon
                    data-testid="contact-check"
                    name="circle-check"
                    className="success"
                  />
                )}
                <OdsText
                  preset={ODS_TEXT_PRESET.heading4}
                  className={
                    tracking?.progress >= 25
                      ? 'primary-title'
                      : 'disabled-title'
                  }
                >
                  {t('tracking_transfert_second_step_title')}
                </OdsText>
              </div>
              {tracking?.currentStep.step ===
                TrackingEnum.ContactConfirmation && (
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
                    {`${t('tracking_transfert_last_update')} ${formatDate(
                      tracking?.lastUpdateDate,
                      l.language,
                    )}`}
                  </OdsText>
                </div>
              )}
            </div>
            <OdsDivider color={ODS_DIVIDER_COLOR.light} />
            <div className="px-3 py-3">
              <div className="pl-4 flex items-center gap-x-2">
                {tracking?.currentStep.step ===
                  TrackingEnum.CurrentRegistrarConfirmation && (
                  <OdsSpinner data-testid="confirmation-spinner" size="xs" />
                )}
                {tracking?.progress > 50 && (
                  <OdsIcon
                    data-testid="confirmation-check"
                    name="circle-check"
                    className="success"
                  />
                )}
                <OdsText
                  preset={ODS_TEXT_PRESET.heading4}
                  className={
                    tracking?.progress >= 50
                      ? 'primary-title'
                      : 'disabled-title'
                  }
                >
                  {t('tracking_transfert_third_step_operation_title')}
                </OdsText>
              </div>
              {tracking?.currentStep.step ===
                TrackingEnum.CurrentRegistrarConfirmation && (
                <div
                  className="pl-5 mt-1 flex flex-col gap-y-2"
                  data-testid="confirmation-section"
                >
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    {t('tracking_transfert_third_step_operation_info')}
                  </OdsText>
                  <OdsText preset={ODS_TEXT_PRESET.paragraph} className="block">
                    {`${t('tracking_transfert_last_update')} ${formatDate(
                      tracking?.lastUpdateDate,
                      l.language,
                    )}`}
                  </OdsText>
                </div>
              )}
            </div>
            <OdsDivider color={ODS_DIVIDER_COLOR.light} />
            <div className="px-3 py-3">
              <div className="pl-4 flex items-center gap-x-2">
                {tracking?.currentStep.step === TrackingEnum.Finalization && (
                  <OdsSpinner data-testid="finalization-spinner" size="xs" />
                )}
                <OdsText
                  preset={ODS_TEXT_PRESET.heading4}
                  className={
                    tracking?.progress >= 75
                      ? 'primary-title'
                      : 'disabled-title'
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
                    <li>
                      {t('tracking_transfert_fourth_step_operation_list_1')}
                    </li>
                    <li>
                      {t('tracking_transfert_fourth_step_operation_list_2')}
                    </li>
                  </ul>
                  <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                    {`${t('tracking_transfert_last_update')} ${formatDate(
                      tracking?.lastUpdateDate,
                      l.language,
                    )}`}
                  </OdsText>
                </div>
              )}
            </div>
          </OdsCard>

          {tracking?.currentStep.step !== TrackingEnum.Finalization && (
            <OdsMessage isDismissible={false} className="w-full">
              <div className="flex flex-col">
                <OdsText preset={ODS_TEXT_PRESET.heading6} className="block">
                  {t('domain_operations_progress_instructions')}
                </OdsText>
                <OdsText preset={ODS_TEXT_PRESET.span} className="block">
                  {t('domain_operations_progress_instructions_7')}
                </OdsText>
              </div>
            </OdsMessage>
          )}
        </div>
      )}
    </BaseLayout>
  );
}
