import { BaseLayout, GuideButton } from '@ovh-ux/manager-react-components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsButton,
  OdsCard,
  OdsDivider,
  OdsIcon,
  OdsLink,
  OdsMessage,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormatDateLight } from '@/hooks/date/useFormatDate';
import { TrackingEnum } from '@/enum/tracking.enum';
import { getOperationTrackingStatus } from '@/data/api/tracking';
import { getmeTaskDomainId } from '@/data/api/web-domain-dns-ongoing-operations';
import Loading from '@/components/Loading/Loading';
import SubHeader from "@/components/SubHeader";
import { ODS_TEXT_PRESET } from "@ovhcloud/ods-components";

export default function Track() {
  const { t } = useTranslation('dashboard');
  const [isTransfertFinalised, setTransfertFinalised] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const fetchTransfertTracking = async (routeId: string) => {
    const response = await getOperationTrackingStatus(id);
    return response.data;
  };

  const fetchDomainData = async (routeId: string) => {
    const response = await getmeTaskDomainId(id);
    return response.data;
  };

  const { data: tracking, isLoading } = useQuery({
    queryKey: ['tracking'],
    queryFn: () => fetchTransfertTracking(id),
  });

  const { data: domain } = useQuery({
    queryKey: ['domain'],
    queryFn: () => fetchDomainData(id),
  });

  useEffect(() => {
    if (domain?.taskStatus === 'done') {
      setTransfertFinalised(true);
    }
  }, [domain?.taskStatus]);

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
        headerButton: (
          <GuideButton
            items={[
              {
                href: 'https://www.ovh.com',
                id: 1,
                label: 'ovh.com',
                target: '_blank',
              },
              {
                href:
                  'https://help.ovhcloud.com/csm/fr-documentation?id=kb_home',
                id: 2,
                label: 'Guides OVH',
                target: '_blank',
              },
            ]}
          />
        ),
        title: t('domain_operations_dashboard_title'),
      }}
    >
      <SubHeader domain={domain} />

      {isTransfertFinalised ? (
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col gap-y-3 items-center justify-center mb-4">
            <OdsIcon name="check" className="success text-2xl mb-4" />
            <OdsText preset={ODS_TEXT_PRESET.heading3}>Votre transfert est finalisé !</OdsText>
          </div>
          <OdsText className="mb-8" preset={ODS_TEXT_PRESET.paragraph}>Merci d’avoir choisi OVHcloud !</OdsText>
          <OdsButton
            label="Découvrez mon tableau de bord domain"
            onClick={() => navigate('/domain')}
          />
        </div>
      ) : (
        <div>
          <OdsCard color="neutral" className="w-3/4 mb-4">
            <div className="px-3 py-3">
              <div className="pl-4 flex items-center gap-x-2">
                {tracking?.currentStep.step === 'initialisation' && (
                  <OdsSpinner size="xs" />
                )}
                {tracking?.progress > 0 && (
                  <OdsIcon name="circle-check" className="success" />
                )}
                <OdsText preset="heading-4">
                  {t('domain_operations_progress_step_1_title')}
                </OdsText>
              </div>
              <div className="pl-5 mt-1">
                {tracking?.currentStep.step === TrackingEnum.initialisation && (
                  <div>
                    <OdsText preset={ODS_TEXT_PRESET.span}>Votre opération a été crée.</OdsText>
                    <OdsText preset={ODS_TEXT_PRESET.paragraph} className="block">
                      Neuf étapes effectuées par le robot avant envoie de la
                      demande au registre.
                    </OdsText>
                    <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                      Last update :{' '}
                      {useFormatDateLight(tracking?.lastUpdateDate)}
                    </OdsText>
                  </div>
                )}
              </div>
            </div>
            <OdsDivider color="light" />
            <div className="px-3 py-3">
              <div className="pl-4 flex items-center gap-x-2">
                {tracking?.currentStep.step ===
                  TrackingEnum.contactConfirmation && <OdsSpinner size="xs" />}
                {tracking?.progress > 25 && (
                  <OdsIcon name="circle-check" className="success" />
                )}
                <OdsText
                  preset={ODS_TEXT_PRESET.heading4}
                  className={
                    tracking?.progress > 25 ? 'primary-title' : 'disabled-title'
                  }
                >
                  Vérification de la validité des informations de contact.
                </OdsText>
              </div>
              {tracking?.currentStep.step === 'Contacts Confirmation' && (
                <div className="pl-5 mt-1 flex flex-col gap-y-2">
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    Pendant ce temps le domaine reste fonctionnel tant que les
                    DNS ne sont pas modifiés.
                  </OdsText>
                  <OdsMessage isDismissible={false}>
                    <div>
                      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                        Vous pourriez recevoir un email de votre ancien
                        registrar vous invitant à vérifier vos informations de
                        contact (cet email sera envoyé à l'adresse enregistrée
                        pour le contact administratif dans le WHOIS).
                      </OdsText>
                      <OdsText preset={ODS_TEXT_PRESET.span}>
                        Merci de valider le transfert en suivant le lien ou les
                        instructions indiquées dans ce message.
                      </OdsText>
                    </div>
                  </OdsMessage>
                  <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                    Last update : {useFormatDateLight(tracking?.lastUpdateDate)}
                  </OdsText>
                </div>
              )}
            </div>
            <OdsDivider color="light" />
            <div className="px-3 py-3">
              <div className="pl-4 flex items-center gap-x-2">
                {tracking?.currentStep.step ===
                  TrackingEnum.currentRegistrarConfirmation && (
                  <OdsSpinner size="xs" />
                )}
                {tracking?.progress > 50 && (
                  <OdsIcon name="circle-check" className="success" />
                )}
                <OdsText
                  preset={ODS_TEXT_PRESET.heading4}
                  className={
                    tracking?.progress > 50 ? 'primary-title' : 'disabled-title'
                  }
                >
                  Confirmation par votre ancien registrar
                </OdsText>
              </div>
              {tracking?.currentStep.step ===
                TrackingEnum.currentRegistrarConfirmation && (
                <div className="pl-5 mt-1 flex flex-col gap-y-2">
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    Ce processus peut prendre jusqu'à 5 à 7 jours selon les
                    règles du registre concerné.
                  </OdsText>
                  <OdsText preset={ODS_TEXT_PRESET.paragraph} className="block">
                    Last update : {useFormatDateLight(tracking?.lastUpdateDate)}
                  </OdsText>
                </div>
              )}
            </div>
            <OdsDivider color="light" />
            <div className="px-3 py-3">
              <div className="pl-4 flex items-center gap-x-2">
                {tracking?.currentStep.step === TrackingEnum.finalization && (
                  <OdsSpinner size="xs" />
                )}
                <OdsText
                  preset={ODS_TEXT_PRESET.heading4}
                  className={
                    tracking?.progress >= 75
                      ? 'primary-title'
                      : 'disabled-title'
                  }
                >
                  Finalisation du transfert
                </OdsText>
              </div>
              {tracking?.currentStep.step === TrackingEnum.finalization && (
                <div className="pl-5 mt-1 flex flex-col gap-y-2">
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    Finalisation du transfert en cours.
                  </OdsText>
                  <ul>
                    <li>
                      Modification des DNS (à configurer manuellement si
                      nécessaire)
                    </li>
                    <li>Génération du WHOIS</li>
                  </ul>
                  <OdsText preset={ODS_TEXT_PRESET.paragraph}>Last update : 12/01/25</OdsText>
                </div>
              )}
            </div>
          </OdsCard>

          {tracking?.currentStep.step !== TrackingEnum.finalization && (
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
