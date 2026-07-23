import { createElement, type ReactNode } from 'react';

import { MemoryRouter } from 'react-router-dom';

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { LicenseApiValue, LicenseFamily, OrderStepId, VdpTier } from '@/types/Order.type';

import { useOrderForm } from './useOrderForm';

// Le hook persiste ses choix en sessionStorage (partagé dans le jsdom du fichier) :
// on repart d'un storage vierge à chaque test pour éviter toute fuite d'état.
beforeEach(() => {
  sessionStorage.clear();
});

// useOrderForm lit/écrit l'étape courante via useSearchParams : le hook doit être
// monté dans un Router pour les tests.
const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(MemoryRouter, null, children);

const renderOrderForm = () => renderHook(() => useOrderForm(), { wrapper });

/** Remplit l'étape 3 avec des valeurs valides (hors NAT). */
function fillServerVault(result: { current: ReturnType<typeof useOrderForm> }) {
  act(() => result.current.setField('displayName', 'backup-prod'));
  act(() => result.current.setField('backupServerExternalIp', '185.26.17.45'));
  act(() => result.current.setField('vaultDisplayName', 'vault-prod'));
  act(() => result.current.selectRegion('eu-west-par'));
}

describe('useOrderForm — flux des étapes selon la famille', () => {
  it('présélectionne les options recommandées (Data Platform + Premium)', () => {
    const { result } = renderOrderForm();
    expect(result.current.family).toBe(LicenseFamily.DATA_PLATFORM);
    expect(result.current.tier).toBe(VdpTier.PREMIUM);
    // La famille recommandée étant Data Platform, le flux complet est exposé d'emblée.
    expect(result.current.steps).toEqual([
      OrderStepId.LICENSE_TYPE,
      OrderStepId.VDP_TIER,
      OrderStepId.SERVER_VAULT,
    ]);
    // Étapes 1 et 2 déjà valides : l'utilisateur peut avancer sans cliquer.
    expect(result.current.isCurrentStepValid).toBe(true);
  });

  it('Enterprise Plus → 2 étapes, sans l\'étape VDP', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    expect(result.current.steps).toEqual([OrderStepId.LICENSE_TYPE, OrderStepId.SERVER_VAULT]);
  });

  it('Data Platform → 3 étapes avec l\'étape VDP', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.DATA_PLATFORM));
    expect(result.current.steps).toEqual([
      OrderStepId.LICENSE_TYPE,
      OrderStepId.VDP_TIER,
      OrderStepId.SERVER_VAULT,
    ]);
  });

  it('goNext saute directement à l\'étape 3 pour Enterprise Plus', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    act(() => result.current.goNext());
    expect(result.current.currentStep).toBe(OrderStepId.SERVER_VAULT);
  });

  it('goNext va à l\'étape VDP pour Data Platform', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.DATA_PLATFORM));
    act(() => result.current.goNext());
    expect(result.current.currentStep).toBe(OrderStepId.VDP_TIER);
  });

  it('changer de famille (VDP → Enterprise) réinitialise le tier', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.DATA_PLATFORM));
    act(() => result.current.selectTier(VdpTier.PREMIUM));
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    expect(result.current.tier).toBeNull();
  });
});

describe('useOrderForm — résolution de la valeur API', () => {
  it('Enterprise Plus résout son enum', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    expect(result.current.resolvedLicenseApiValue).toBe(LicenseApiValue.ENTERPRISE_PLUS);
  });

  it('par défaut (Data Platform + Premium présélectionnés) résout l\'enum du tier recommandé', () => {
    const { result } = renderOrderForm();
    expect(result.current.resolvedLicenseApiValue).toBe(LicenseApiValue.VDP_PREMIUM);
  });

  it('VDP + Premium résout l\'enum du tier', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.DATA_PLATFORM));
    act(() => result.current.selectTier(VdpTier.PREMIUM));
    expect(result.current.resolvedLicenseApiValue).toBe(LicenseApiValue.VDP_PREMIUM);
  });
});

describe('useOrderForm — validation de l\'étape Serveur & Vault', () => {
  it('canSubmit devient vrai quand tous les champs requis sont valides', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    expect(result.current.canSubmit).toBe(false);
    fillServerVault(result);
    expect(result.current.canSubmit).toBe(true);
  });

  it('une IP publique invalide bloque la soumission', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    fillServerVault(result);
    act(() => result.current.setField('backupServerExternalIp', '999.999.0.1'));
    expect(result.current.canSubmit).toBe(false);
  });

  it('le NAT activé rend l\'IP privée obligatoire', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    fillServerVault(result);
    act(() => result.current.toggleNat(true));
    expect(result.current.canSubmit).toBe(false);
    act(() => result.current.setField('backupServerPrivateIp', '192.168.1.10'));
    expect(result.current.canSubmit).toBe(true);
  });

  it('présélectionne la première région du catalogue par défaut', () => {
    const { result } = renderOrderForm();
    expect(result.current.form.regionApiValue).toBe('eu-west-par');
  });

  it('la région étant présélectionnée, remplir les champs suffit à soumettre', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    act(() => result.current.setField('displayName', 'backup-prod'));
    act(() => result.current.setField('backupServerExternalIp', '185.26.17.45'));
    act(() => result.current.setField('vaultDisplayName', 'vault-prod'));
    // Aucun appel à selectRegion : la région par défaut suffit.
    expect(result.current.canSubmit).toBe(true);
  });
});

describe('useOrderForm — affichage des erreurs', () => {
  it('n\'affiche pas d\'erreur requise avant interaction', () => {
    const { result } = renderOrderForm();
    expect(result.current.errors.displayName).toBeNull();
  });

  it('affiche l\'erreur requise après touchField', () => {
    const { result } = renderOrderForm();
    act(() => result.current.touchField('displayName'));
    expect(result.current.errors.displayName).toBe('field.service_name.error');
  });

  it('affiche l\'erreur de format IP dès qu\'une valeur invalide est saisie', () => {
    const { result } = renderOrderForm();
    act(() => result.current.setField('backupServerExternalIp', '10.0.0'));
    expect(result.current.errors.backupServerExternalIp).toBe('field.public_ip.error');
  });

  it('affiche toutes les erreurs requises après une tentative de soumission', () => {
    const { result } = renderOrderForm();
    act(() => result.current.setSubmitAttempted(true));
    expect(result.current.errors.displayName).toBe('field.service_name.error');
    expect(result.current.errors.vaultDisplayName).toBe('field.vault_name.error');
  });
});

describe('useOrderForm — persistance sessionStorage', () => {
  it('restaure la sélection après un remontage du hook (refresh simulé)', () => {
    const { result, unmount } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    act(() => result.current.setField('displayName', 'backup-prod'));
    act(() => result.current.setField('vaultDisplayName', 'vault-prod'));
    unmount();

    // Nouveau montage (comme après un refresh) : l'état persisté doit revenir.
    const { result: restored } = renderOrderForm();
    expect(restored.current.family).toBe(LicenseFamily.ENTERPRISE_PLUS);
    expect(restored.current.form.displayName).toBe('backup-prod');
    expect(restored.current.form.vaultDisplayName).toBe('vault-prod');
  });

  it('clearPersistedOrder efface la reprise : le montage suivant repart des défauts', () => {
    const { result, unmount } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    act(() => result.current.clearPersistedOrder());
    unmount();

    const { result: restored } = renderOrderForm();
    expect(restored.current.family).toBe(LicenseFamily.DATA_PLATFORM);
  });
});
