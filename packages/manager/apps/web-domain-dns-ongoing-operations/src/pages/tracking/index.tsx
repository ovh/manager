import {
  BaseLayout,
  GuideButton,
} from '@ovh-ux/manager-react-components';
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import {
  OdsCard,
  OdsDivider,
  OdsMessage,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import json from '@/json/tracking.json';

export default function Track() {
  const { t } = useTranslation('dashboard');
  const [isTransfertFinalised, setTransfertFinalised] = useState(false)
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
      description={t('domain_operations_dashboard_info')}
    >
      {isTransfertFinalised ? (
        <p>oui</p>
      ) : (
        <div>
          <OdsCard color="neutral" className="w-full mb-4">
            <div className="px-4 py-2">
              <div className="flex gap-x-2">
                <OdsSpinner size="xs" />
                <div>
                  <div>
                    <OdsText preset="heading-4">
                      {t('domain_operations_progress_step_1_title')}
                    </OdsText>
                  </div>
                  <div>
                    <OdsText preset="span">Votre opération a été crée.</OdsText>
                    <OdsText preset="paragraph" className="block">
                      Neuf étapes effectuées par le robot avant envoie de la demande
                      au registre.
                    </OdsText>
                    <OdsText preset="paragraph">Last update : 12/01/25</OdsText>
                  </div>
                </div>
              </div>
            </div>
            <OdsDivider color="light" />
            <div className="px-4 py-2">
              <div className="flex gap-x-2">
                <OdsSpinner size="xs" />
                <div>
                  <div>
                    <OdsText preset="heading-4">
                      Vérification de la validité des informations de contact.
                    </OdsText>
                  </div>
                  <div>
                    <OdsText preset="span">
                      Pendant ce temps le domaine reste fonctionnel tant que les DNS
                      ne sont pas modifiés.
                    </OdsText>
                    <OdsMessage isDismissible={false}>
                      <div>
                        <OdsText preset="paragraph">
                          Vous pourriez recevoir un email de votre ancien registrar
                          vous invitant à vérifier vos informations de contact (cet
                          email sera envoyé à l'adresse enregistrée pour le contact
                          administratif dans le WHOIS).
                        </OdsText>
                        <OdsText preset="span">
                          Merci de valider le transfert en suivant le lien ou les
                          instructions indiquées dans ce message.
                        </OdsText>
                      </div>
                    </OdsMessage>
                    <OdsText preset="paragraph">Last update : 12/01/25</OdsText>
                  </div>
                </div>
              </div>
            </div>
            <OdsDivider color="light" />
            <div className="px-4 py-2">
              <div className="flex gap-x-2">
                <OdsSpinner size="xs" />
                <div>
                  <div>
                    <OdsText preset="heading-4">
                      Confirmation par votre ancien registrar
                    </OdsText>
                  </div>
                  <div>
                    <OdsText preset="span">
                      Ce processus peut prendre jusqu'à 5 à 7 jours selon les règles du registre concerné.
                    </OdsText>
                    <OdsText preset="paragraph" className="block">Last update : 12/01/25</OdsText>
                  </div>
                </div>
              </div>
            </div>
            <OdsDivider color="light" />
            <div className="px-4 py-2">
              <div className="flex gap-x-2">
                <OdsSpinner size="xs" />
                <div>
                  <div>
                    <OdsText preset="heading-4">Finalisation du transfert</OdsText>
                  </div>
                  <div>
                    <OdsText preset="span">
                      Finalisation du transfert en cours.
                    </OdsText>
                    <ul>
                      <li>Modification des DNS (à configurer manuellement si nécessaire)</li>
                      <li>Génération du WHOIS</li>
                    </ul>
                    <OdsText preset="paragraph">Last update : 12/01/25</OdsText>
                  </div>
                </div>
              </div>
            </div>
          </OdsCard>
          <OdsMessage isDismissible={false} className="w-full">
            <div className="flex flex-col">
              <OdsText preset="heading-6" className="block">
                {t('domain_operations_progress_instructions')}
              </OdsText>
              <OdsText className="block">
                {t('domain_operations_progress_instructions_7')}
              </OdsText>
            </div>
          </OdsMessage>
        </div>
      )}

    </BaseLayout>
  );
}
