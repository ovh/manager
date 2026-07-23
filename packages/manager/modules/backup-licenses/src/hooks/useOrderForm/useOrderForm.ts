import { useCallback, useEffect, useMemo, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import { LICENSE_CARDS, VDP_TIER_CARDS } from '@/data/licenses.data';
import { VAULT_REGIONS } from '@/data/regions.data';
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
  // Une région est présélectionnée par défaut (1re du catalogue) pour éviter que
  // l'utilisateur ait à cliquer une carte de localisation obligatoirement.
  regionApiValue: VAULT_REGIONS[0]?.apiValue ?? null,
};

// Présélection des options « recommandées » pour que l'utilisateur puisse avancer
// sans cliquer (bouton « Continuer » actif dès l'arrivée sur les étapes 1 et 2).
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

/** Ordre effectif des étapes selon la famille de licence. */
function getSteps(family: LicenseFamily | null): OrderStepId[] {
  if (family === LicenseFamily.ENTERPRISE_PLUS) {
    return [OrderStepId.LICENSE_TYPE, OrderStepId.SERVER_VAULT];
  }
  if (family === LicenseFamily.DATA_PLATFORM) {
    return [OrderStepId.LICENSE_TYPE, OrderStepId.VDP_TIER, OrderStepId.SERVER_VAULT];
  }
  return [OrderStepId.LICENSE_TYPE];
}

const STEP_PARAM = 'step';

/** Slug d'URL exposé pour chaque étape (?step=...). */
const STEP_SLUGS: Record<OrderStepId, string> = {
  [OrderStepId.LICENSE_TYPE]: 'license-type',
  [OrderStepId.VDP_TIER]: 'vdp-tier',
  [OrderStepId.SERVER_VAULT]: 'server-vault',
};

const SLUG_TO_STEP = Object.fromEntries(
  Object.entries(STEP_SLUGS).map(([step, slug]) => [slug, step as OrderStepId]),
) as Record<string, OrderStepId>;

export function useOrderForm() {
  // Reprise des choix persistés en sessionStorage (survit au refresh / au démontage
  // de la page lors d'un aller-retour hors du funnel). Lecture unique au montage.
  const persisted = useMemo(() => readPersistedOrderState(EMPTY_FORM), []);

  const [family, setFamily] = useState<LicenseFamily | null>(
    persisted ? persisted.family : DEFAULT_FAMILY,
  );
  const [tier, setTier] = useState<VdpTier | null>(persisted ? persisted.tier : DEFAULT_TIER);
  const [form, setForm] = useState<ServerVaultFormState>(persisted ? persisted.form : EMPTY_FORM);
  const [touched, setTouched] = useState<Set<OrderFieldName>>(new Set());
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Sauvegarde de l'état métier à chaque changement (les états de validation UI
  // — touched / submitAttempted — ne sont volontairement pas persistés).
  useEffect(() => {
    writePersistedOrderState({ family, tier, form });
  }, [family, tier, form]);

  const steps = useMemo(() => getSteps(family), [family]);

  // L'étape courante est pilotée par l'URL (?step=...) : le bouton « précédent » du
  // navigateur revient ainsi à l'étape précédente au lieu de quitter le funnel.
  const stepFromUrl = SLUG_TO_STEP[searchParams.get(STEP_PARAM) ?? ''] ?? OrderStepId.LICENSE_TYPE;
  const currentStep = steps.includes(stepFromUrl) ? stepFromUrl : (steps[0] ?? OrderStepId.LICENSE_TYPE);
  const currentIndex = Math.max(0, steps.indexOf(currentStep));
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;

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

  const goToStep = useCallback(
    (step: OrderStepId) => {
      // push (et non replace) : chaque étape devient une entrée d'historique navigable.
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set(STEP_PARAM, STEP_SLUGS[step]);
        return next;
      });
    },
    [setSearchParams],
  );

  const goNext = useCallback(() => {
    const next = steps[steps.indexOf(currentStep) + 1];
    if (next) goToStep(next);
  }, [steps, currentStep, goToStep]);

  const goBackStep = useCallback(() => {
    const prev = steps[steps.indexOf(currentStep) - 1];
    if (prev) goToStep(prev);
  }, [steps, currentStep, goToStep]);

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

  // Premier champ bloquant, dans l'ordre d'affichage — indépendant de touched/submitAttempted
  // pour que « Commander » puisse amener l'utilisateur droit au champ à corriger.
  const firstInvalidField = useMemo<OrderFieldName | null>(() => {
    if (form.displayName.trim() === '') return 'displayName';
    if (!isValidIp(form.backupServerExternalIp)) return 'backupServerExternalIp';
    if (form.isBehindNat && !isValidIp(form.backupServerPrivateIp)) {
      return 'backupServerPrivateIp';
    }
    if (form.vaultDisplayName.trim() === '') return 'vaultDisplayName';
    return null;
  }, [form]);

  const isServerVaultValid = useMemo(() => {
    const nameOk = form.displayName.trim() !== '';
    const externalOk = isValidIp(form.backupServerExternalIp);
    const privateOk = !form.isBehindNat || isValidIp(form.backupServerPrivateIp);
    const vaultOk = form.vaultDisplayName.trim() !== '';
    const regionOk = form.regionApiValue !== null;
    return nameOk && externalOk && privateOk && vaultOk && regionOk;
  }, [form]);

  const isCurrentStepValid = useMemo(() => {
    switch (currentStep) {
      case OrderStepId.LICENSE_TYPE:
        return family !== null;
      case OrderStepId.VDP_TIER:
        return tier !== null;
      case OrderStepId.SERVER_VAULT:
        return isServerVaultValid;
      default:
        return false;
    }
  }, [currentStep, family, tier, isServerVaultValid]);

  const resolvedLicenseApiValue = useMemo<LicenseApiValue | null>(() => {
    if (family === LicenseFamily.ENTERPRISE_PLUS) return LicenseApiValue.ENTERPRISE_PLUS;
    if (family === LicenseFamily.DATA_PLATFORM && tier) {
      return VDP_TIER_CARDS.find((card) => card.tier === tier)?.apiValue ?? null;
    }
    return null;
  }, [family, tier]);

  const canSubmit = family !== null && isServerVaultValid && resolvedLicenseApiValue !== null;

  return {
    family,
    tier,
    form,
    steps,
    currentStep,
    currentIndex,
    isFirstStep,
    isLastStep,
    errors,
    firstInvalidField,
    isCurrentStepValid,
    canSubmit,
    resolvedLicenseApiValue,
    selectFamily,
    selectTier,
    setField,
    touchField,
    toggleNat,
    selectRegion,
    goToStep,
    goNext,
    goBackStep,
    setSubmitAttempted,
    clearPersistedOrder: clearPersistedOrderState,
  };
}

export type UseOrderFormReturn = ReturnType<typeof useOrderForm>;
