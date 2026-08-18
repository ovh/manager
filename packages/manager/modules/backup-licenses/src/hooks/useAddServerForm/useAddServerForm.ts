import { useCallback, useMemo, useState } from 'react';

import { LICENSE_CARDS, VDP_TIER_CARDS } from '@/data/licenses.data';
import { useStep } from '@/hooks/useStep/useStep';
import { LicenseApiValue, LicenseFamily, VdpTier } from '@/types/Order.type';
import { isValidIp } from '@/utils/isValidIp/isValidIp';

export type AddServerFieldName =
  | 'displayName'
  | 'backupServerExternalIp'
  | 'veeamClientIp'
  | 'backupServerPrivateIp';

/** État du formulaire du serveur VBR — pas de champs vault, le vault existe déjà (cf. BKP-1217). */
export interface AddServerFormState {
  displayName: string;
  backupServerExternalIp: string;
  veeamClientIp: string;
  isBehindNat: boolean;
  backupServerPrivateIp: string;
}

/** Erreurs affichables par champ : clé i18n (suffixe du namespace order) ou null. */
export type AddServerFieldErrors = Record<AddServerFieldName, string | null>;

/** Les 2 étapes du stepper réduit — pas de vault ni de localisation (déjà configurés). */
export enum AddServerStepId {
  LICENSE = 'LICENSE',
  SERVER = 'SERVER',
}

const EMPTY_FORM: AddServerFormState = {
  displayName: '',
  backupServerExternalIp: '',
  veeamClientIp: '',
  isBehindNat: false,
  backupServerPrivateIp: '',
};

// Présélection des options « recommandées », comme dans useOrderForm — le bouton
// « Continuer » de l'étape licence est actif dès l'arrivée sur la page.
const DEFAULT_FAMILY = LICENSE_CARDS.find((card) => card.recommended)?.family ?? null;
const DEFAULT_TIER = VDP_TIER_CARDS.find((card) => card.recommended)?.tier ?? null;

function isLicenseValidFor(family: LicenseFamily | null, tier: VdpTier | null): boolean {
  return family !== null && (family !== LicenseFamily.DATA_PLATFORM || tier !== null);
}

function isServerValidFor(form: AddServerFormState): boolean {
  const nameOk = form.displayName.trim() !== '';
  const externalOk = isValidIp(form.backupServerExternalIp);
  const privateOk = !form.isBehindNat || isValidIp(form.backupServerPrivateIp);
  return nameOk && externalOk && privateOk;
}

/**
 * Variante réduite de useOrderForm (BKP-1217) : déclenchée depuis « Ajouter un
 * serveur » sur la liste des serveurs, donc le vault et sa localisation ont déjà
 * été configurés à la première commande — seules les étapes licence et serveur
 * VBR restent. Pas de persistance sessionStorage : parcours court, initié depuis
 * une page qui a déjà chargé les données du service.
 */
export function useAddServerForm() {
  const [family, setFamily] = useState<LicenseFamily | null>(DEFAULT_FAMILY);
  const [tier, setTier] = useState<VdpTier | null>(DEFAULT_TIER);
  const [form, setForm] = useState<AddServerFormState>(EMPTY_FORM);
  const [touched, setTouched] = useState<Set<AddServerFieldName>>(new Set());
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const licenseStep = useStep({ isOpen: true });
  const serverStep = useStep();

  const selectFamily = useCallback((next: LicenseFamily) => {
    setFamily(next);
    // Changer de famille invalide le tier précédemment choisi.
    if (next !== LicenseFamily.DATA_PLATFORM) {
      setTier(null);
    }
  }, []);

  const selectTier = useCallback((next: VdpTier) => setTier(next), []);

  const setField = useCallback(
    <K extends keyof AddServerFormState>(key: K, value: AddServerFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const touchField = useCallback((field: AddServerFieldName) => {
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

  const errors = useMemo<AddServerFieldErrors>(() => {
    const show = (field: AddServerFieldName) => touched.has(field) || submitAttempted;
    const requiredError = (field: AddServerFieldName, value: string, key: string) =>
      show(field) && value.trim() === '' ? key : null;
    const ipError = (field: AddServerFieldName, value: string, key: string) => {
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
      veeamClientIp: null,
      backupServerPrivateIp: form.isBehindNat
        ? ipError('backupServerPrivateIp', form.backupServerPrivateIp, 'field.private_ip.error')
        : null,
    };
  }, [form, touched, submitAttempted]);

  // Premier champ bloquant, dans l'ordre d'affichage — indépendant de touched/submitAttempted
  // pour que le CTA final puisse amener l'utilisateur droit au champ à corriger.
  const firstInvalidField = useMemo<AddServerFieldName | null>(() => {
    if (form.displayName.trim() === '') return 'displayName';
    if (!isValidIp(form.backupServerExternalIp)) return 'backupServerExternalIp';
    if (form.isBehindNat && !isValidIp(form.backupServerPrivateIp)) {
      return 'backupServerPrivateIp';
    }
    return null;
  }, [form]);

  const isLicenseValid = useMemo(() => isLicenseValidFor(family, tier), [family, tier]);
  const isServerValid = useMemo(() => isServerValidFor(form), [form]);

  const firstInvalidStepId = useMemo<AddServerStepId | null>(() => {
    if (!isLicenseValid) return AddServerStepId.LICENSE;
    if (!isServerValid) return AddServerStepId.SERVER;
    return null;
  }, [isLicenseValid, isServerValid]);

  const resolvedLicenseApiValue = useMemo<LicenseApiValue | null>(() => {
    if (family === LicenseFamily.ENTERPRISE_PLUS) return LicenseApiValue.ENTERPRISE_PLUS;
    if (family === LicenseFamily.DATA_PLATFORM && tier) {
      return VDP_TIER_CARDS.find((card) => card.tier === tier)?.apiValue ?? null;
    }
    return null;
  }, [family, tier]);

  const canSubmit = isLicenseValid && isServerValid && resolvedLicenseApiValue !== null;

  // Validation puis repli de l'étape ① — même déviation assumée que useOrderForm
  // (l'étape se ferme plutôt que de rester ouverte grisée).
  const submitLicense = useCallback(() => {
    if (!isLicenseValid) return;
    licenseStep.check();
    licenseStep.lock();
    licenseStep.close();
    serverStep.open();
  }, [isLicenseValid, licenseStep, serverStep]);

  // Rouvrir l'étape ① réinitialise ② : changer de licence change les niveaux VDP
  // disponibles, la config serveur déjà saisie repart donc à vide.
  const editLicense = useCallback(() => {
    licenseStep.unlock();
    licenseStep.open();
    serverStep.uncheck();
    serverStep.unlock();
    serverStep.close();
    setForm(EMPTY_FORM);
  }, [licenseStep, serverStep]);

  return {
    family,
    tier,
    form,
    errors,
    firstInvalidField,
    firstInvalidStepId,
    isLicenseValid,
    isServerValid,
    canSubmit,
    resolvedLicenseApiValue,
    selectFamily,
    selectTier,
    setField,
    touchField,
    toggleNat,
    license: { step: licenseStep, submit: submitLicense, edit: editLicense },
    server: { step: serverStep },
    submitAttempted,
    setSubmitAttempted,
  };
}

export type UseAddServerFormReturn = ReturnType<typeof useAddServerForm>;
