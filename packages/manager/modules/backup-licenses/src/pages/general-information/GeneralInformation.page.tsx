import React, { Suspense } from 'react';

import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import GeneralInformationTile from '@/components/general-information/GeneralInformationTile/GeneralInformationTile.component';
import ServiceManagementTile from '@/components/general-information/ServiceManagementTile/ServiceManagementTile.component';
import { useGeneralInformation } from '@/hooks/useGeneralInformation/useGeneralInformation';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';

/**
 * Onglet « General information » (BKP-1226) : vue d'ensemble du service en 2 tuiles.
 *
 * Trois états mutuellement exclusifs (§6 de la spec) : l'échec de ③/④ (licence → resourceName,
 * détails du service) remplace les deux tuiles par un bandeau d'erreur ; sinon elles sont
 * toujours rendues, chaque valeur passant individuellement en squelette pendant le chargement.
 * L'échec de ①/② reste géré par l'`ErrorBanner` globale de `ServiceLayoutPage`.
 */
export default function GeneralInformationPage() {
  const { t } = useTranslation([
    BACKUP_LICENSES_NAMESPACES.GENERAL_INFORMATION,
    NAMESPACES.ACTIONS,
  ]);
  const {
    isLoading,
    isError,
    refetch,
    reference,
    resourceName,
    serviceName,
    accessUrl,
    isProvisioning,
    creationDate,
    nextBillingDate,
    contacts,
  } = useGeneralInformation();

  if (isError) {
    return (
      <OdsMessage color={ODS_MESSAGE_COLOR.critical} isDismissible={false}>
        <div className="flex flex-wrap items-center gap-4">
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t(`${BACKUP_LICENSES_NAMESPACES.GENERAL_INFORMATION}:error.loading`)}
          </OdsText>
          <OdsButton
            data-testid="general-information-retry"
            variant={ODS_BUTTON_VARIANT.outline}
            size={ODS_BUTTON_SIZE.sm}
            label={t(`${NAMESPACES.ACTIONS}:retry`)}
            onClick={refetch}
          />
        </div>
      </OdsMessage>
    );
  }

  return (
    <>
      <section className="flex md:flex-row flex-col gap-8">
        <GeneralInformationTile
          reference={reference}
          serviceName={serviceName}
          accessUrl={accessUrl}
          isProvisioning={isProvisioning}
          isLoading={isLoading}
        />
        <ServiceManagementTile
          creationDate={creationDate}
          nextBillingDate={nextBillingDate}
          contacts={contacts}
          resourceName={resourceName}
          isLoading={isLoading}
        />
      </section>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </>
  );
}
