import { useCallback, useEffect, useMemo, useState } from 'react';

import { LICENSE_CARDS, VDP_TIER_CARDS } from '@/data/licenses.data';
import { StepState, useStep } from '@/hooks/useStep/useStep';
import {
  LicenseApiValue,
  LicenseFamily,
  OrderStepId,
  ServerVaultFormState,
  VdpTier,
} from '@/types/Order.type';
import { isValidIp } from '@/utils/isValidIp/isValidIp';

import {
  clearPersistedOrderState,
  readPersistedOrderState,
  writePersistedOrderState,
} from './orderFormStorage';

const EMPTY_FORM: ServerVaultFormState = {
  displayName: '',
  backupServerExternalIp: '',
  isBehindNat: false,
  backupServerPrivateIp: '',
  vaultDisplayName: '',
  // Pas de présélection : la liste vient de `GET /location` et le choix de
  // localisation est définitif — il doit être explicite.
  regionApiValue: null,
};

// Présélection des options « recommandées » pour que l'utilisateur puisse avancer
// sans cliquer (bouton « Continuer » actif dès l'arrivée sur l'étape licence).
// Dérivé du flag `recommended` : si le catalogue change, la valeur par défaut suit.
const DEFAULT_FAMILY = LICENSE_CARDS.find((card) => card.recommended)?.family ?? null;
const DEFAULT_TIER = VDP_TIER_CARDS.find((card) => card.recommended)?.tier ?? null;

export type OrderFieldName =
  | 'displayName'
  | 'backupServerExternalIp'
  | 'backupServerPrivateIp'
  | 'vaultDisplayName';

/** Erreurs affichables par champ : clé i18n (suffixe du namespace order) ou null. */
export type OrderFieldErrors = Record<OrderFieldName, string | null>;

function isLicenseValidFor(family: LicenseFamily | null, tier: VdpTier | null): boolean {
  return family !== null && (family !== LicenseFamily.DATA_PLATFORM || tier !== null);
}

function isServerVaultFieldsValidFor(form: ServerVaultFormState): boolean {
  const nameOk = form.displayName.trim() !== '';
  const externalOk = isValidIp(form.backupServerExternalIp);
  const privateOk = !form.isBehindNat || isValidIp(form.backupServerPrivateIp);
  const vaultOk = form.vaultDisplayName.trim() !== '';
  return nameOk && externalOk && privateOk && vaultOk;
}

/**
 * État initial des 3 étapes, dérivé d'un éventuel instantané persisté (sessionStorage) :
 * une étape dont les données sont valides revient repliée (checked + locked) ; sinon
 * la première étape incomplète s'ouvre. Calculé une seule fois, en synchrone, pour éviter
 * un flash d'état incorrect au montage.
 */
function computeInitialStepStates(
  family: LicenseFamily | null,
  tier: VdpTier | null,
  form: ServerVaultFormState,
): Record<'license' | 'serverVault' | 'location', Readonly<Partial<StepState>>> {
  const licenseOk = isLicenseValidFor(family, tier);
  const serverVaultOk = licenseOk && isServerVaultFieldsValidFor(form);
  const locationOk = serverVaultOk && form.regionApiValue !== null;

  return {
    license: licenseOk ? { isChecked: true, isLocked: true } : { isOpen: true },
    serverVault: serverVaultOk
      ? { isChecked: true, isLocked: true }
      : licenseOk
        ? { isOpen: true }
        : {},
    location: locationOk
      ? { isChecked: true, isLocked: true }
      : serverVaultOk
        ? { isOpen: true }
        : {},
  };
}

export function useOrderForm() {
  // Reprise des choix persistés en sessionStorage (survit au refresh / au démontage
  // de la page lors d'un aller-retour hors de la page). Lecture unique au montage.
  const persisted = useMemo(() => readPersistedOrderState(EMPTY_FORM), []);

  const [family, setFamily] = useState<LicenseFamily | null>(
    persisted ? persisted.family : DEFAULT_FAMILY,
  );
  const [tier, setTier] = useState<VdpTier | null>(persisted ? persisted.tier : DEFAULT_TIER);
  const [form, setForm] = useState<ServerVaultFormState>(persisted ? persisted.form : EMPTY_FORM);
  const [touched, setTouched] = useState<Set<OrderFieldName>>(new Set());
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // La reconstruction ne s'applique que si un instantané existe : la présélection
  // « recommandée » d'une session vierge ne doit pas verrouiller l'étape toute seule.
  const initialStepStates = useMemo(
    () =>
      persisted
        ? computeInitialStepStates(persisted.family, persisted.tier, persisted.form)
        : { license: { isOpen: true }, serverVault: {}, location: {} },
    [],
  );

  const licenseStep = useStep(initialStepStates.license);
  const serverVaultStep = useStep(initialStepStates.serverVault);
  const locationStep = useStep(initialStepStates.location);

  // Sauvegarde de l'état métier à chaque changement (les états de validation UI
  // — touched / submitAttempted — ne sont volontairement pas persistés).
  useEffect(() => {
    writePersistedOrderState({ family, tier, form });
  }, [family, tier, form]);

  const selectFamily = useCallback((next: LicenseFamily) => {
    setFamily(next);
    // Changer de famille invalide le tier précédemment choisi.
    if (next !== LicenseFamily.DATA_PLATFORM) {
      setTier(null);
    }
  }, []);

  const selectTier = useCallback((next: VdpTier) => setTier(next), []);

  const setField = useCallback(
    <K extends keyof ServerVaultFormState>(key: K, value: ServerVaultFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const touchField = useCallback((field: OrderFieldName) => {
    setTouched((prev) => new Set(prev).add(field));
  }, []);

  const toggleNat = useCallback((checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      isBehindNat: checked,
      // Si on désactive le NAT, on repart d'une IP privée vide (non envoyée dans le POST).
      backupServerPrivateIp: checked ? prev.backupServerPrivateIp : '',
    }));
  }, []);

  const selectRegion = useCallback((apiValue: string) => {
    setForm((prev) => ({ ...prev, regionApiValue: apiValue }));
  }, []);

  const errors = useMemo<OrderFieldErrors>(() => {
    const show = (field: OrderFieldName) => touched.has(field) || submitAttempted;
    const requiredError = (field: OrderFieldName, value: string, key: string) =>
      show(field) && value.trim() === '' ? key : null;
    const ipError = (field: OrderFieldName, value: string, key: string) => {
      const trimmed = value.trim();
      if (trimmed !== '' && !isValidIp(trimmed)) return key;
      if (show(field) && trimmed === '') return key;
      return null;
    };

    return {
      displayName: requiredError('displayName', form.displayName, 'field.service_name.error'),
      backupServerExternalIp: ipError(
        'backupServerExternalIp',
        form.backupServerExternalIp,
        'field.public_ip.error',
      ),
      backupServerPrivateIp: form.isBehindNat
        ? ipError('backupServerPrivateIp', form.backupServerPrivateIp, 'field.private_ip.error')
        : null,
      vaultDisplayName: requiredError(
        'vaultDisplayName',
        form.vaultDisplayName,
        'field.vault_name.error',
      ),
    };
  }, [form, touched, submitAttempted]);

  // Premier champ bloquant du bloc serveur/vault, dans l'ordre d'affichage — indépendant
  // de touched/submitAttempted pour que « Finaliser ma commande » puisse amener
  // l'utilisateur droit au champ à corriger.
  const firstInvalidField = useMemo<OrderFieldName | null>(() => {
    if (form.displayName.trim() === '') return 'displayName';
    if (!isValidIp(form.backupServerExternalIp)) return 'backupServerExternalIp';
    if (form.isBehindNat && !isValidIp(form.backupServerPrivateIp)) {
      return 'backupServerPrivateIp';
    }
    if (form.vaultDisplayName.trim() === '') return 'vaultDisplayName';
    return null;
  }, [form]);

  const isLicenseValid = useMemo(() => isLicenseValidFor(family, tier), [family, tier]);
  const isServerVaultValid = useMemo(() => isServerVaultFieldsValidFor(form), [form]);
  const isLocationValid = form.regionApiValue !== null;

  // Première étape invalide, dans l'ordre — utilisée par le CTA final pour rouvrir
  // l'étape fautive plutôt que de désactiver silencieusement le bouton.
  const firstInvalidStepId = useMemo<OrderStepId | null>(() => {
    if (!isLicenseValid) return OrderStepId.LICENSE;
    if (!isServerVaultValid) return OrderStepId.SERVER_VAULT;
    if (!isLocationValid) return OrderStepId.LOCATION;
    return null;
  }, [isLicenseValid, isServerVaultValid, isLocationValid]);

  const resolvedLicenseApiValue = useMemo<LicenseApiValue | null>(() => {
    if (family === LicenseFamily.ENTERPRISE_PLUS) return LicenseApiValue.ENTERPRISE_PLUS;
    if (family === LicenseFamily.DATA_PLATFORM && tier) {
      return VDP_TIER_CARDS.find((card) => card.tier === tier)?.apiValue ?? null;
    }
    return null;
  }, [family, tier]);

  const canSubmit =
    isLicenseValid && isServerVaultValid && isLocationValid && resolvedLicenseApiValue !== null;

  // Validation puis repli de l'étape ① — l'étape se ferme (close) plutôt que de rester
  // ouverte grisée (déviation assumée du modèle pci-workflow, cf. spec §6).
  const submitLicense = useCallback(() => {
    if (!isLicenseValid) return;
    licenseStep.check();
    licenseStep.lock();
    licenseStep.close();
    serverVaultStep.open();
  }, [isLicenseValid, licenseStep, serverVaultStep]);

  // Rouvrir l'étape ① réinitialise ②③ : changer de licence change les niveaux VDP
  // disponibles et invalide la configuration serveur/vault déjà saisie.
  const editLicense = useCallback(() => {
    licenseStep.unlock();
    licenseStep.open();
    serverVaultStep.uncheck();
    serverVaultStep.unlock();
    serverVaultStep.close();
    locationStep.uncheck();
    locationStep.unlock();
    locationStep.close();
    setForm(EMPTY_FORM);
  }, [licenseStep, serverVaultStep, locationStep]);

  const submitServerVault = useCallback(() => {
    if (!isServerVaultValid) return;
    serverVaultStep.check();
    serverVaultStep.lock();
    serverVaultStep.close();
    locationStep.open();
  }, [isServerVaultValid, serverVaultStep, locationStep]);

  // Rouvrir l'étape ② réinitialise ③ : la région n'est pas remise en cause par un
  // changement de champ serveur/vault, mais on la remet à sa valeur par défaut par
  // cohérence avec la règle de cascade (cf. spec §6).
  const editServerVault = useCallback(() => {
    serverVaultStep.unlock();
    serverVaultStep.open();
    locationStep.uncheck();
    locationStep.unlock();
    locationStep.close();
    setField('regionApiValue', EMPTY_FORM.regionApiValue);
  }, [serverVaultStep, locationStep, setField]);

  // Dernière étape : rien à réinitialiser après elle.
  const editLocation = useCallback(() => {
    locationStep.unlock();
    locationStep.open();
  }, [locationStep]);

  return {
    family,
    tier,
    form,
    errors,
    firstInvalidField,
    firstInvalidStepId,
    isLicenseValid,
    isServerVaultValid,
    isLocationValid,
    canSubmit,
    resolvedLicenseApiValue,
    selectFamily,
    selectTier,
    setField,
    touchField,
    toggleNat,
    selectRegion,
    license: { step: licenseStep, submit: submitLicense, edit: editLicense },
    serverVault: { step: serverVaultStep, submit: submitServerVault, edit: editServerVault },
    location: { step: locationStep, edit: editLocation },
    submitAttempted,
    setSubmitAttempted,
    clearPersistedOrder: clearPersistedOrderState,
  };
}

export type UseOrderFormReturn = ReturnType<typeof useOrderForm>;
