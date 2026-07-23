import { LicenseFamily, ServerVaultFormState, VdpTier } from '@/types/Order.type';

/**
 * Persistance des choix du tunnel de commande dans le sessionStorage.
 *
 * Objectif : conserver la sélection (famille, tier, champs serveur/vault) au sein
 * d'une même session d'onglet, afin qu'un rafraîchissement ou un aller-retour hors
 * du funnel (qui démonte `OrderPage`) ne réinitialise pas les cartes/inputs.
 *
 * Portée « session » volontaire : une nouvelle session d'onglet repart d'un funnel
 * vierge (pas de reprise indéfinie via localStorage).
 */

const STORAGE_KEY = 'hpc-backup-licenses.order-funnel';

/** Instantané sérialisable de l'état métier du funnel (hors état de validation UI). */
export interface PersistedOrderState {
  family: LicenseFamily | null;
  tier: VdpTier | null;
  form: ServerVaultFormState;
}

/** Accès défensif au sessionStorage (indisponible en SSR ou si bloqué par le navigateur). */
function getStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.sessionStorage : null;
  } catch {
    return null;
  }
}

function isFamily(value: unknown): value is LicenseFamily | null {
  return value === null || Object.values(LicenseFamily).includes(value as LicenseFamily);
}

function isTier(value: unknown): value is VdpTier | null {
  return value === null || Object.values(VdpTier).includes(value as VdpTier);
}

/**
 * Lit l'instantané persisté, ou `null` si absent/illisible/corrompu.
 * On valide famille et tier (énums) et on fusionne le formulaire avec `emptyForm`
 * pour rester robuste à une évolution de schéma (champs ajoutés ultérieurement).
 */
export function readPersistedOrderState(
  emptyForm: ServerVaultFormState,
): PersistedOrderState | null {
  const storage = getStorage();
  if (!storage) return null;

  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedOrderState>;
    if (!isFamily(parsed.family) || !isTier(parsed.tier)) return null;

    return {
      family: parsed.family ?? null,
      tier: parsed.tier ?? null,
      form: { ...emptyForm, ...(parsed.form ?? {}) },
    };
  } catch {
    return null;
  }
}

/** Écrit l'instantané courant (silencieux si le storage est indisponible ou plein). */
export function writePersistedOrderState(state: PersistedOrderState): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota atteint ou storage bloqué : la persistance est un confort, on n'échoue pas.
  }
}

/** Efface l'instantané (à appeler une fois la commande soumise). */
export function clearPersistedOrderState(): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}
