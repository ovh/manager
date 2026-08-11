import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { LicenseApiValue, LicenseFamily, OrderStepId, VdpTier } from '@/types/Order.type';

import { useOrderForm } from './useOrderForm';

// Le hook persiste ses choix en sessionStorage (partagé dans le jsdom du fichier) :
// on repart d'un storage vierge à chaque test pour éviter toute fuite d'état.
beforeEach(() => {
  sessionStorage.clear();
});

const renderOrderForm = () => renderHook(() => useOrderForm());

/** Remplit le bloc serveur/vault avec des valeurs valides (hors NAT). */
function fillServerVault(result: { current: ReturnType<typeof useOrderForm> }) {
  act(() => result.current.setField('displayName', 'backup-prod'));
  act(() => result.current.setField('backupServerExternalIp', '185.26.17.45'));
  act(() => result.current.setField('vaultDisplayName', 'vault-prod'));
}

/** Amène le hook jusqu'à l'étape ③ ouverte, toutes les données valides et étapes ①② verrouillées. */
function progressToLocation(result: { current: ReturnType<typeof useOrderForm> }) {
  act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
  act(() => result.current.license.submit());
  fillServerVault(result);
  act(() => result.current.serverVault.submit());
}

describe('useOrderForm — présélection et sélection de licence', () => {
  it("présélectionne les options recommandées (Data Platform + Advanced) sans verrouiller l'étape", () => {
    const { result } = renderOrderForm();
    expect(result.current.family).toBe(LicenseFamily.DATA_PLATFORM);
    expect(result.current.tier).toBe(VdpTier.ADVANCED);
    // Présélection = confort pour cliquer "Continuer" tout de suite, pas une validation automatique.
    expect(result.current.license.step.isOpen).toBe(true);
    expect(result.current.license.step.isLocked).toBe(false);
  });

  it('Data Platform sans niveau choisi rend la licence invalide (dévoilement des cartes VDP)', () => {
    const { result } = renderOrderForm();
    // Passer par Enterprise Plus vide le tier ; revenir sur Data Platform ne le
    // représelectionne pas — l'utilisateur doit choisir une carte de niveau.
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    act(() => result.current.selectFamily(LicenseFamily.DATA_PLATFORM));
    expect(result.current.tier).toBeNull();
    expect(result.current.isLicenseValid).toBe(false);
  });

  it('changer de famille (VDP → Enterprise) réinitialise le tier', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.DATA_PLATFORM));
    act(() => result.current.selectTier(VdpTier.PREMIUM));
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    expect(result.current.tier).toBeNull();
    expect(result.current.isLicenseValid).toBe(true);
  });
});

describe('useOrderForm — résolution de la valeur API', () => {
  it('Enterprise Plus résout son enum', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    expect(result.current.resolvedLicenseApiValue).toBe(LicenseApiValue.ENTERPRISE_PLUS);
  });

  it("par défaut (Data Platform + Advanced présélectionnés) résout l'enum du tier recommandé", () => {
    const { result } = renderOrderForm();
    expect(result.current.resolvedLicenseApiValue).toBe(LicenseApiValue.VDP_ADVANCED);
  });
});

describe('useOrderForm — orchestration des étapes (submit)', () => {
  it('license.submit() ne fait rien tant que la licence est invalide', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    act(() => result.current.selectFamily(LicenseFamily.DATA_PLATFORM));
    act(() => result.current.license.submit());
    expect(result.current.license.step.isLocked).toBe(false);
  });

  it("license.submit() verrouille et replie l'étape ①, ouvre l'étape ②", () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    act(() => result.current.license.submit());
    expect(result.current.license.step.isChecked).toBe(true);
    expect(result.current.license.step.isLocked).toBe(true);
    expect(result.current.license.step.isOpen).toBe(false);
    expect(result.current.serverVault.step.isOpen).toBe(true);
  });

  it('serverVault.submit() ne fait rien tant que les champs sont invalides', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    act(() => result.current.license.submit());
    act(() => result.current.serverVault.submit());
    expect(result.current.serverVault.step.isLocked).toBe(false);
  });

  it("serverVault.submit() verrouille et replie l'étape ②, ouvre l'étape ③", () => {
    const { result } = renderOrderForm();
    progressToLocation(result);
    expect(result.current.serverVault.step.isChecked).toBe(true);
    expect(result.current.serverVault.step.isLocked).toBe(true);
    expect(result.current.serverVault.step.isOpen).toBe(false);
    expect(result.current.location.step.isOpen).toBe(true);
  });
});

describe('useOrderForm — cascade au « Modifier »', () => {
  it("rouvrir l'étape ① réinitialise ②③ et vide le formulaire serveur/vault/région", () => {
    const { result } = renderOrderForm();
    progressToLocation(result);
    act(() => result.current.selectRegion('eu-west-gra'));

    act(() => result.current.license.edit());

    expect(result.current.license.step.isLocked).toBe(false);
    expect(result.current.license.step.isOpen).toBe(true);
    expect(result.current.serverVault.step.isChecked).toBe(false);
    expect(result.current.serverVault.step.isLocked).toBe(false);
    expect(result.current.location.step.isChecked).toBe(false);
    expect(result.current.location.step.isLocked).toBe(false);
    expect(result.current.form.displayName).toBe('');
    expect(result.current.form.vaultDisplayName).toBe('');
    expect(result.current.form.regionApiValue).toBeNull();
  });

  it("rouvrir l'étape ② réinitialise ③ (région) sans toucher aux champs serveur/vault", () => {
    const { result } = renderOrderForm();
    progressToLocation(result);
    act(() => result.current.selectRegion('eu-west-gra'));
    act(() => result.current.location.step.check());

    act(() => result.current.serverVault.edit());

    expect(result.current.serverVault.step.isLocked).toBe(false);
    expect(result.current.serverVault.step.isOpen).toBe(true);
    expect(result.current.location.step.isChecked).toBe(false);
    expect(result.current.location.step.isLocked).toBe(false);
    expect(result.current.form.displayName).toBe('backup-prod');
    expect(result.current.form.regionApiValue).toBeNull();
  });

  it("rouvrir l'étape ③ ne modifie aucune autre étape", () => {
    const { result } = renderOrderForm();
    progressToLocation(result);

    act(() => result.current.location.edit());

    expect(result.current.location.step.isLocked).toBe(false);
    expect(result.current.location.step.isOpen).toBe(true);
    expect(result.current.serverVault.step.isChecked).toBe(true);
    expect(result.current.serverVault.step.isLocked).toBe(true);
  });
});

describe('useOrderForm — validation du bloc serveur/vault', () => {
  it('isServerVaultValid devient vrai quand tous les champs requis sont valides', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    expect(result.current.isServerVaultValid).toBe(false);
    fillServerVault(result);
    expect(result.current.isServerVaultValid).toBe(true);
  });

  it('une IP publique invalide bloque la validation', () => {
    const { result } = renderOrderForm();
    fillServerVault(result);
    act(() => result.current.setField('backupServerExternalIp', '999.999.0.1'));
    expect(result.current.isServerVaultValid).toBe(false);
  });

  it("le NAT activé rend l'IP privée obligatoire", () => {
    const { result } = renderOrderForm();
    fillServerVault(result);
    act(() => result.current.toggleNat(true));
    expect(result.current.isServerVaultValid).toBe(false);
    act(() => result.current.setField('backupServerPrivateIp', '192.168.1.10'));
    expect(result.current.isServerVaultValid).toBe(true);
  });

  it('ne présélectionne aucune localisation (le choix du Vault est définitif)', () => {
    const { result } = renderOrderForm();
    expect(result.current.form.regionApiValue).toBeNull();
    expect(result.current.isLocationValid).toBe(false);
  });
});

describe('useOrderForm — canSubmit et première étape invalide', () => {
  it('canSubmit est faux tant que la licence, le serveur/vault ou la région ne sont pas valides', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    expect(result.current.canSubmit).toBe(false);
    fillServerVault(result);
    expect(result.current.canSubmit).toBe(false);
    act(() => result.current.selectRegion('eu-west-par'));
    expect(result.current.canSubmit).toBe(true);
  });

  it('firstInvalidStepId pointe la licence quand Data Platform est choisi sans niveau', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    act(() => result.current.selectFamily(LicenseFamily.DATA_PLATFORM));
    expect(result.current.firstInvalidStepId).toBe(OrderStepId.LICENSE);
  });

  it('firstInvalidStepId pointe le serveur/vault quand la licence est valide mais les champs sont vides', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    expect(result.current.firstInvalidStepId).toBe(OrderStepId.SERVER_VAULT);
  });

  it('firstInvalidStepId pointe la localisation quand seule la région manque', () => {
    const { result } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    fillServerVault(result);
    expect(result.current.firstInvalidStepId).toBe(OrderStepId.LOCATION);
  });
});

describe('useOrderForm — affichage des erreurs', () => {
  it("n'affiche pas d'erreur requise avant interaction", () => {
    const { result } = renderOrderForm();
    expect(result.current.errors.displayName).toBeNull();
  });

  it("affiche l'erreur requise après touchField", () => {
    const { result } = renderOrderForm();
    act(() => result.current.touchField('displayName'));
    expect(result.current.errors.displayName).toBe('field.service_name.error');
  });

  it("affiche l'erreur de format IP dès qu'une valeur invalide est saisie", () => {
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

describe('useOrderForm — persistance et reconstruction depuis sessionStorage', () => {
  it('restaure la sélection après un remontage du hook (refresh simulé), étape ouverte si incomplète', () => {
    const { result, unmount } = renderOrderForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    act(() => result.current.setField('displayName', 'backup-prod'));
    act(() => result.current.setField('vaultDisplayName', 'vault-prod'));
    unmount();

    // Nouveau montage (comme après un refresh) : l'état persisté doit revenir. La
    // licence est valide (checked + locked + repliée), le serveur/vault reste ouvert
    // car l'IP publique n'a jamais été renseignée.
    const { result: restored } = renderOrderForm();
    expect(restored.current.family).toBe(LicenseFamily.ENTERPRISE_PLUS);
    expect(restored.current.form.displayName).toBe('backup-prod');
    expect(restored.current.license.step.isChecked).toBe(true);
    expect(restored.current.license.step.isLocked).toBe(true);
    expect(restored.current.serverVault.step.isOpen).toBe(true);
    expect(restored.current.serverVault.step.isChecked).toBe(false);
  });

  it('reconstruit les 2 premières étapes repliées quand toutes les données persistées sont valides', () => {
    const { result, unmount } = renderOrderForm();
    progressToLocation(result);
    act(() => result.current.selectRegion('eu-west-par'));
    unmount();

    const { result: restored } = renderOrderForm();
    expect(restored.current.license.step.isChecked).toBe(true);
    expect(restored.current.license.step.isLocked).toBe(true);
    expect(restored.current.serverVault.step.isChecked).toBe(true);
    expect(restored.current.serverVault.step.isLocked).toBe(true);
  });

  it("laisse l'étape de localisation ouverte à la reprise, pour que les contrats restent lisibles", () => {
    const { result, unmount } = renderOrderForm();
    progressToLocation(result);
    act(() => result.current.selectRegion('eu-west-par'));
    unmount();

    const { result: restored } = renderOrderForm();
    expect(restored.current.location.step.isChecked).toBe(true);
    expect(restored.current.location.step.isOpen).toBe(true);
    expect(restored.current.location.step.isLocked).toBe(false);
  });

  it("une session vierge n'auto-verrouille pas la licence malgré la présélection recommandée", () => {
    const { result } = renderOrderForm();
    expect(result.current.license.step.isChecked).toBe(false);
    expect(result.current.license.step.isLocked).toBe(false);
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
