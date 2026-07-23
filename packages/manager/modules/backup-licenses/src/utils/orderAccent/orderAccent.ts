/**
 * Classes Tailwind du tunnel de commande (BKP-1208), basées sur les tokens du
 * design system ODS via variables CSS (`var(--ods-color-*)`) — PAS d'hex en dur.
 *
 * Décision 2026-07-23 : pas de violet (absent d'ODS) → tout accent de sélection = `primary`.
 * checks/étape validée/badges = `success` ; erreurs = `critical` ; secondaire = `neutral`.
 */

/** Bordure + halo d'une carte sélectionnée (accent primary). */
export const SELECTED_CARD_CLASS =
  'border-[var(--ods-color-primary-500)] shadow-[0_0_0_3px_var(--ods-color-primary-100)]';

/** Bordure du radio sélectionné. */
export const SELECTED_RADIO_BORDER_CLASS = 'border-[var(--ods-color-primary-500)]';

/** Fond du point radio sélectionné. */
export const SELECTED_RADIO_DOT_CLASS = 'bg-[var(--ods-color-primary-500)]';

/** Check de feature par défaut (success). */
export const FEATURE_CHECK_DEFAULT_CLASS = 'text-[var(--ods-color-success-500)]';

/** Check de feature mise en avant (accent primary). */
export const FEATURE_CHECK_HIGHLIGHT_CLASS = 'text-[var(--ods-color-primary-500)]';
