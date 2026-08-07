import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LicenseApiValue, LicenseFamily, VdpTier } from '@/types/Order.type';

import { AddServerStepId, useAddServerForm } from './useAddServerForm';

const renderAddServerForm = () => renderHook(() => useAddServerForm());

/** Remplit le bloc serveur avec des valeurs valides (hors NAT). */
function fillServer(result: { current: ReturnType<typeof useAddServerForm> }) {
  act(() => result.current.setField('displayName', 'backup-prod'));
  act(() => result.current.setField('backupServerExternalIp', '185.26.17.45'));
}

describe('useAddServerForm — présélection et sélection de licence', () => {
  it("présélectionne les options recommandées (Data Platform + Advanced) sans verrouiller l'étape", () => {
    const { result } = renderAddServerForm();
    expect(result.current.family).toBe(LicenseFamily.DATA_PLATFORM);
    expect(result.current.tier).toBe(VdpTier.ADVANCED);
    expect(result.current.license.step.isOpen).toBe(true);
    expect(result.current.license.step.isLocked).toBe(false);
  });

  it('changer de famille (VDP → Enterprise) réinitialise le tier', () => {
    const { result } = renderAddServerForm();
    act(() => result.current.selectFamily(LicenseFamily.DATA_PLATFORM));
    act(() => result.current.selectTier(VdpTier.PREMIUM));
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    expect(result.current.tier).toBeNull();
    expect(result.current.isLicenseValid).toBe(true);
  });
});

describe('useAddServerForm — résolution de la valeur API', () => {
  it('Enterprise Plus résout son enum', () => {
    const { result } = renderAddServerForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    expect(result.current.resolvedLicenseApiValue).toBe(LicenseApiValue.ENTERPRISE_PLUS);
  });
});

describe('useAddServerForm — orchestration des étapes (submit)', () => {
  it('license.submit() ne fait rien tant que la licence est invalide', () => {
    const { result } = renderAddServerForm();
    // Passer par Enterprise Plus vide le tier ; revenir sur Data Platform ne le
    // représélectionne pas — la licence reste invalide sans choix de niveau.
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    act(() => result.current.selectFamily(LicenseFamily.DATA_PLATFORM));
    act(() => result.current.license.submit());
    expect(result.current.license.step.isLocked).toBe(false);
  });

  it("license.submit() verrouille et replie l'étape ①, ouvre l'étape ②", () => {
    const { result } = renderAddServerForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    act(() => result.current.license.submit());
    expect(result.current.license.step.isChecked).toBe(true);
    expect(result.current.license.step.isLocked).toBe(true);
    expect(result.current.license.step.isOpen).toBe(false);
    expect(result.current.server.step.isOpen).toBe(true);
  });

  it("rouvrir l'étape ① réinitialise ② et vide le formulaire serveur", () => {
    const { result } = renderAddServerForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    act(() => result.current.license.submit());
    fillServer(result);
    act(() => result.current.server.step.check());

    act(() => result.current.license.edit());

    expect(result.current.license.step.isLocked).toBe(false);
    expect(result.current.license.step.isOpen).toBe(true);
    expect(result.current.server.step.isChecked).toBe(false);
    expect(result.current.server.step.isLocked).toBe(false);
    expect(result.current.form.displayName).toBe('');
  });
});

describe('useAddServerForm — validation du bloc serveur', () => {
  it('isServerValid devient vrai quand tous les champs requis sont valides', () => {
    const { result } = renderAddServerForm();
    expect(result.current.isServerValid).toBe(false);
    fillServer(result);
    expect(result.current.isServerValid).toBe(true);
  });

  it('une IP publique invalide bloque la validation', () => {
    const { result } = renderAddServerForm();
    fillServer(result);
    act(() => result.current.setField('backupServerExternalIp', '999.999.0.1'));
    expect(result.current.isServerValid).toBe(false);
  });

  it("le NAT activé rend l'IP privée obligatoire", () => {
    const { result } = renderAddServerForm();
    fillServer(result);
    act(() => result.current.toggleNat(true));
    expect(result.current.isServerValid).toBe(false);
    act(() => result.current.setField('backupServerPrivateIp', '192.168.1.10'));
    expect(result.current.isServerValid).toBe(true);
  });

  it("désactiver le NAT vide l'IP privée déjà saisie", () => {
    const { result } = renderAddServerForm();
    act(() => result.current.toggleNat(true));
    act(() => result.current.setField('backupServerPrivateIp', '192.168.1.10'));
    act(() => result.current.toggleNat(false));
    expect(result.current.form.backupServerPrivateIp).toBe('');
  });
});

describe('useAddServerForm — canSubmit et première étape invalide', () => {
  it('canSubmit est faux tant que la licence ou le serveur ne sont pas valides', () => {
    const { result } = renderAddServerForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    expect(result.current.canSubmit).toBe(false);
    fillServer(result);
    expect(result.current.canSubmit).toBe(true);
  });

  it('firstInvalidStepId pointe le serveur quand la licence est valide mais les champs sont vides', () => {
    const { result } = renderAddServerForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    expect(result.current.firstInvalidStepId).toBe(AddServerStepId.SERVER);
  });

  it('firstInvalidStepId est nul quand tout est valide', () => {
    const { result } = renderAddServerForm();
    act(() => result.current.selectFamily(LicenseFamily.ENTERPRISE_PLUS));
    fillServer(result);
    expect(result.current.firstInvalidStepId).toBeNull();
  });
});

describe('useAddServerForm — affichage des erreurs', () => {
  it("n'affiche pas d'erreur requise avant interaction", () => {
    const { result } = renderAddServerForm();
    expect(result.current.errors.displayName).toBeNull();
  });

  it("affiche l'erreur requise après touchField", () => {
    const { result } = renderAddServerForm();
    act(() => result.current.touchField('displayName'));
    expect(result.current.errors.displayName).toBe('field.service_name.error');
  });

  it('affiche toutes les erreurs requises après une tentative de soumission', () => {
    const { result } = renderAddServerForm();
    act(() => result.current.setSubmitAttempted(true));
    expect(result.current.errors.displayName).toBe('field.service_name.error');
    expect(result.current.errors.backupServerExternalIp).toBe('field.public_ip.error');
  });
});
