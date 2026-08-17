import { useCallback, useMemo, useState } from 'react';

import { VDP_TIER_CARDS } from '@/data/licenses.data';
import { useStep } from '@/hooks/useStep/useStep';
import { BackupServerResource } from '@/types/BackupServer.type';
import { LicenseApiValue, LicenseFamily, VdpTier } from '@/types/Order.type';
import { firstIpWithoutMask } from '@/utils/formatIpList/formatIpList';
import { isValidIp } from '@/utils/isValidIp/isValidIp';
import { getLicenseEditRules } from '@/utils/licenseEditRules/licenseEditRules';

export type EditFormField = 'displayName' | 'externalIp' | 'privateIp';
export type EditFormErrors = Record<EditFormField, string | null>;
export type EditStepId = 'license' | 'server';

type EditFormState = {
  displayName: string;
  externalIp: string;
  privateIp: string;
};

/** Un champ modifié par rapport au serveur installé, valeurs brutes (§ récap avant/après). */
export type EditFormChange = {
  field: EditFormField | 'licenseType';
  before: string;
  after: string;
};

function familyOf(licenseType?: string): LicenseFamily | null {
  if (!licenseType) return null;
  return licenseType === (LicenseApiValue.ENTERPRISE_PLUS as string)
    ? LicenseFamily.ENTERPRISE_PLUS
    : LicenseFamily.DATA_PLATFORM;
}

function tierOf(licenseType?: string): VdpTier | null {
  return VDP_TIER_CARDS.find((card) => card.apiValue === licenseType)?.tier ?? null;
}

/**
 * Formulaire d'édition d'un serveur VBR (BKP-1218), sur le modèle de `useOrderForm` : 2 étapes
 * fixes (Licence, Serveur VBR) orchestrées par `useStep`. Contrairement au tunnel de commande,
 * les deux étapes portent des domaines indépendants — changer de licence ne remet pas en
 * cause les champs serveur — donc pas de cascade de réinitialisation au « Modifier ».
 * Pas de persistance `sessionStorage` non plus : la page est ouverte pour éditer un serveur
 * précis, rien à restituer après un rafraîchissement.
 */
export function useEditBackupServerForm(server?: BackupServerResource) {
  const [form, setForm] = useState<EditFormState | null>(null);
  const [family, setFamily] = useState<LicenseFamily | null>(null);
  const [tier, setTier] = useState<VdpTier | null>(null);
  const [touched, setTouched] = useState<Set<EditFormField>>(new Set());
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const licenseStep = useStep({ isOpen: true });
  const serverStep = useStep();

  // Règles de changement de licence selon la version VBR/l'OS du serveur installé (cf. utils) :
  // ne dépend que de `server`, jamais de la sélection en cours.
  const licenseEditRules = useMemo(() => getLicenseEditRules(server?.currentState), [server]);

  // Seeding unique depuis la donnée serveur, ajusté PENDANT LE RENDU plutôt que dans un effet
  // (cf. react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes) :
  // `form` reste `null` tant qu'elle n'est pas chargée, puis se fige à sa première valeur pour
  // ne pas écraser la saisie de l'utilisateur au refetch suivant (polling, autre mutation…).
  if (server && form === null) {
    setForm({
      displayName: server.currentState.displayName,
      externalIp: firstIpWithoutMask(server.currentState.externalIps),
      privateIp: firstIpWithoutMask(server.currentState.privateIps),
    });
    setFamily(familyOf(server.currentState.licenseType));
    setTier(tierOf(server.currentState.licenseType));
  }

  const selectFamily = useCallback(
    (next: LicenseFamily) => {
      if (!licenseEditRules.canEditFamily) return;
      setFamily(next);
      if (next === LicenseFamily.ENTERPRISE_PLUS) {
        // Enterprise Plus n'a pas de niveau.
        setTier(null);
      } else {
        // Choisir Data Platform pose le niveau recommandé, sauf si on y est déjà.
        setTier((prev) => prev ?? VDP_TIER_CARDS.find((card) => card.recommended)?.tier ?? null);
      }
    },
    [licenseEditRules.canEditFamily],
  );

  const selectTier = useCallback(
    (next: VdpTier) => {
      if (!licenseEditRules.canEditTier) return;
      setTier(next);
    },
    [licenseEditRules.canEditTier],
  );

  const setField = useCallback(<K extends keyof EditFormState>(key: K, value: EditFormState[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const touchField = useCallback((field: EditFormField) => {
    setTouched((prev) => new Set(prev).add(field));
  }, []);

  const errors = useMemo<EditFormErrors>(() => {
    const show = (field: EditFormField) => touched.has(field) || submitAttempted;
    const requiredError = (field: EditFormField, value: string, key: string) =>
      show(field) && value.trim() === '' ? key : null;
    const ipError = (field: EditFormField, value: string, key: string) => {
      const trimmed = value.trim();
      if (trimmed !== '' && !isValidIp(trimmed)) return key;
      if (show(field) && trimmed === '') return key;
      return null;
    };

    return {
      displayName: requiredError('displayName', form?.displayName ?? '', 'edit.field.name.error'),
      externalIp: ipError('externalIp', form?.externalIp ?? '', 'edit.field.public_ip.error'),
      privateIp: ipError('privateIp', form?.privateIp ?? '', 'edit.field.private_ip.error'),
    };
  }, [form, touched, submitAttempted]);

  const resolvedLicenseApiValue = useMemo<LicenseApiValue | null>(() => {
    if (family === LicenseFamily.ENTERPRISE_PLUS) return LicenseApiValue.ENTERPRISE_PLUS;
    if (family === LicenseFamily.DATA_PLATFORM && tier) {
      return VDP_TIER_CARDS.find((card) => card.tier === tier)?.apiValue ?? null;
    }
    return null;
  }, [family, tier]);

  const isLicenseValid = resolvedLicenseApiValue !== null;
  const isServerFieldsValid =
    !!form &&
    form.displayName.trim() !== '' &&
    isValidIp(form.externalIp) &&
    isValidIp(form.privateIp);
  const isValid = isLicenseValid && isServerFieldsValid;

  // Première étape invalide, dans l'ordre — utilisée par le CTA final pour rouvrir l'étape
  // fautive plutôt que de désactiver silencieusement le bouton (modèle `useOrderForm`).
  const firstInvalidStepId = useMemo<EditStepId | null>(() => {
    if (!isLicenseValid) return 'license';
    if (!isServerFieldsValid) return 'server';
    return null;
  }, [isLicenseValid, isServerFieldsValid]);

  // Validation puis repli de l'étape ① — pas de cascade sur ② : le bloc serveur est un
  // domaine indépendant de la licence.
  const submitLicense = useCallback(() => {
    if (!isLicenseValid) return;
    licenseStep.check();
    licenseStep.lock();
    licenseStep.close();
    serverStep.open();
  }, [isLicenseValid, licenseStep, serverStep]);

  const editLicense = useCallback(() => {
    licenseStep.unlock();
    licenseStep.open();
  }, [licenseStep]);

  const editServer = useCallback(() => {
    serverStep.unlock();
    serverStep.open();
  }, [serverStep]);

  // Récap « avant → après » : ne liste que les champs dont la valeur saisie diffère de celle
  // installée sur le serveur, en valeurs brutes — la page se charge de traduire le libellé de
  // licence. La comparaison se fait sur la licence *installée* (`licenseType`), pas sur
  // `licenseTypeRequested` : un changement déjà programmé reste modifiable.
  const changes = useMemo<EditFormChange[]>(() => {
    if (!server || !form) return [];
    const list: EditFormChange[] = [];

    if (form.displayName !== server.currentState.displayName) {
      list.push({
        field: 'displayName',
        before: server.currentState.displayName,
        after: form.displayName,
      });
    }
    const installedExternalIp = firstIpWithoutMask(server.currentState.externalIps);
    if (form.externalIp !== installedExternalIp) {
      list.push({ field: 'externalIp', before: installedExternalIp, after: form.externalIp });
    }
    const installedPrivateIp = firstIpWithoutMask(server.currentState.privateIps);
    if (form.privateIp !== installedPrivateIp) {
      list.push({ field: 'privateIp', before: installedPrivateIp, after: form.privateIp });
    }
    if (resolvedLicenseApiValue && resolvedLicenseApiValue !== server.currentState.licenseType) {
      list.push({
        field: 'licenseType',
        before: server.currentState.licenseType ?? '',
        after: resolvedLicenseApiValue,
      });
    }

    return list;
  }, [server, form, resolvedLicenseApiValue]);

  // Message d'info licence différée : sélection différente de la licence installée, pas de
  // `licenseTypeRequested` (même raison que le récap ci-dessus).
  const isLicenseChanged =
    !!server &&
    !!resolvedLicenseApiValue &&
    resolvedLicenseApiValue !== server.currentState.licenseType;

  return {
    form,
    family,
    tier,
    errors,
    isValid,
    isLicenseValid,
    isServerFieldsValid,
    firstInvalidStepId,
    changes,
    isLicenseChanged,
    resolvedLicenseApiValue,
    licenseEditRules,
    selectFamily,
    selectTier,
    setField,
    touchField,
    submitAttempted,
    setSubmitAttempted,
    license: { step: licenseStep, submit: submitLicense, edit: editLicense },
    server: { step: serverStep, edit: editServer },
  };
}

export type UseEditBackupServerFormReturn = ReturnType<typeof useEditBackupServerForm>;
