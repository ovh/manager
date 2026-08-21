import React, { useContext, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import { OdsSpinner } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  BaseLayout,
  Breadcrumb,
  ChangelogButton,
  GuideButton,
  StepComponent,
  useNotifications,
} from '@ovh-ux/manager-react-components';

import { BackupLicensesContext } from '@/BackupLicenses.context';
import EditLicenseStep from '@/components/linked-servers/EditLicenseStep/EditLicenseStep.component';
import EditRecapPanel from '@/components/linked-servers/EditRecapPanel/EditRecapPanel.component';
import EditServerFieldsStep from '@/components/linked-servers/EditServerFieldsStep/EditServerFieldsStep.component';
import { useEditBackupServer } from '@/data/hooks/useEditBackupServer/useEditBackupServer';
import { LICENSE_CARDS, VDP_TIER_CARDS } from '@/data/licenses.data';
import { backupServersQueries } from '@/data/queries/backupServers.queries';
import { useBackupLicenseUrn } from '@/hooks/useBackupLicenseUrn/useBackupLicenseUrn';
import { useEditBackupServerForm } from '@/hooks/useEditBackupServerForm/useEditBackupServerForm';
import { useMainGuideItem } from '@/hooks/useMainGuideItem';
import { BACKUP_LICENSES_NAMESPACES, CHANGELOG_LINKS, LABELS } from '@/module.constants';
import { routeUrls } from '@/routes/routes.constants';
import { LicenseFamily } from '@/types/Order.type';

/**
 * Page d'édition d'un serveur VBR (BKP-1218) : reprend la structure du tunnel de commande
 * (`Order.page.tsx`) — `BaseLayout` + stepper vertical `StepComponent` + panneau récap sticky
 * — plutôt qu'une modale, pour rester cohérent avec le reste du parcours. 2 étapes fixes
 * (Licence, Serveur VBR), contre 3 pour la commande : pas d'étape Vault/Localisation, ces
 * champs ne sont pas éditables ici.
 *
 * Contrairement au tunnel de commande, le formulaire est pré-rempli depuis un serveur existant
 * et l'appel `PUT` est réel (mocké) : nom et IP sont appliqués immédiatement, un changement de
 * licence est différé au 1er du mois suivant (message d'info dans l'étape ①).
 */
export default function EditBackupServerPage() {
  const { t } = useTranslation([
    BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS,
    BACKUP_LICENSES_NAMESPACES.ORDER,
    NAMESPACES.ACTIONS,
  ]);
  const { appName } = useContext(BackupLicensesContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addSuccess } = useNotifications();
  const guideItems = useMainGuideItem();
  const backupLicenseUrn = useBackupLicenseUrn();
  const { backupServerId } = useParams<{ backupServerId: string }>();

  const { data: servers, isPending: areServersPending } = useQuery(
    backupServersQueries.withClient(queryClient).list(),
  );
  const server = servers?.find(({ id }) => id === backupServerId);

  const {
    form,
    family,
    tier,
    errors,
    isValid,
    firstInvalidStepId,
    changes,
    isLicenseChanged,
    resolvedLicenseApiValue,
    licenseEditRules,
    selectFamily,
    selectTier,
    setField,
    touchField,
    setSubmitAttempted,
    license,
    server: serverStep,
  } = useEditBackupServerForm(server);

  const {
    mutate: editBackupServer,
    isPending,
    isSuccess,
    error,
  } = useEditBackupServer({
    onSuccess: () => {
      addSuccess(t(`${BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS}:edit.success`));
      navigate(routeUrls.linkedServers);
    },
  });

  // Serveur introuvable une fois la liste chargée (lien obsolète, serveur supprimé entretemps) :
  // la liste fait foi, on y renvoie sans message d'erreur.
  useEffect(() => {
    if (!areServersPending && !server && !isPending && !isSuccess) {
      navigate(routeUrls.linkedServers, { replace: true });
    }
  }, [areServersPending, server, isPending, isSuccess, navigate]);

  if (!form || !server) {
    return (
      <div className="flex justify-center pt-10">
        <OdsSpinner />
      </div>
    );
  }

  const familyKey = LICENSE_CARDS.find((card) => card.family === family)?.i18nKey ?? null;
  const tierKey = VDP_TIER_CARDS.find((card) => card.tier === tier)?.i18nKey ?? null;
  const licenseCollapsedValue = [
    familyKey ? t(`${BACKUP_LICENSES_NAMESPACES.ORDER}:license.${familyKey}.title`) : '',
    family === LicenseFamily.DATA_PLATFORM && tierKey
      ? t(`${BACKUP_LICENSES_NAMESPACES.ORDER}:tier.${tierKey}.title`)
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleSave = () => {
    setSubmitAttempted(true);
    if (!isValid) {
      // Feedback actionnable plutôt qu'un bouton grisé : on rouvre l'étape fautive.
      if (firstInvalidStepId === 'license') license.edit();
      else if (firstInvalidStepId === 'server') serverStep.edit();
      return;
    }
    if (!backupServerId || !resolvedLicenseApiValue) return;

    editBackupServer({
      backupServerId,
      displayName: form.displayName,
      licenseType: resolvedLicenseApiValue,
      externalIps: [form.externalIp],
      privateIps: [form.privateIp],
    });
  };

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb appName={appName} rootLabel={appName} />}
      header={{
        title: LABELS.BACKUP_LICENSES,
        changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
        headerButton: <GuideButton items={guideItems} />,
      }}
      backLinkLabel={t(`${NAMESPACES.ACTIONS}:back`)}
      onClickReturn={() => navigate(routeUrls.linkedServers)}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-8">
          <StepComponent
            order={1}
            {...license.step}
            title={
              license.step.isLocked ? (
                <Trans
                  t={t}
                  i18nKey="step.license_type.collapsed_title"
                  ns={BACKUP_LICENSES_NAMESPACES.ORDER}
                  values={{ value: licenseCollapsedValue }}
                  components={{ b: <b /> }}
                />
              ) : (
                t(`${BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS}:edit.field.license_type.label`)
              )
            }
            next={{
              action: license.submit,
              label: t(`${BACKUP_LICENSES_NAMESPACES.ORDER}:step.continue`),
            }}
            edit={{
              action: license.edit,
              label: t(`${BACKUP_LICENSES_NAMESPACES.ORDER}:summary.edit`),
            }}
          >
            <EditLicenseStep
              family={family}
              tier={tier}
              onSelectFamily={selectFamily}
              onSelectTier={selectTier}
              isLicenseChanged={isLicenseChanged}
              licenseEditRules={licenseEditRules}
            />
          </StepComponent>

          <StepComponent
            order={2}
            {...serverStep.step}
            title={
              serverStep.step.isLocked ? (
                <Trans
                  t={t}
                  i18nKey="edit.step.server.collapsed_title"
                  values={{ value: form.displayName }}
                  components={{ b: <b /> }}
                />
              ) : (
                t(`${BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS}:edit.step.server.label`)
              )
            }
            edit={{
              action: serverStep.edit,
              label: t(`${BACKUP_LICENSES_NAMESPACES.ORDER}:summary.edit`),
            }}
          >
            <EditServerFieldsStep
              server={server}
              form={form}
              errors={errors}
              onFieldChange={setField}
              onFieldBlur={touchField}
            />
          </StepComponent>
        </div>

        <aside className="sticky top-8 self-start">
          <EditRecapPanel
            family={family}
            tier={tier}
            displayName={form.displayName}
            externalIp={form.externalIp}
            privateIp={form.privateIp}
            changes={changes}
            errorMessage={
              error
                ? [
                    t(`${BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS}:edit.error`, {
                      serverName: server.currentState.displayName,
                    }),
                    error.response?.data?.message,
                  ]
                    .filter(Boolean)
                    .join(' ')
                : null
            }
            isSaving={isPending}
            onSave={handleSave}
            urn={backupLicenseUrn}
          />
        </aside>
      </div>
    </BaseLayout>
  );
}
