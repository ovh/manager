import { useCallback, useMemo, useState } from 'react';

import { BackupServerResource } from '@/types/BackupServer.type';
import { firstIpWithoutMask } from '@/utils/formatIpList/formatIpList';
import { isValidIp } from '@/utils/isValidIp/isValidIp';

export type EditFormField = 'displayName' | 'externalIp' | 'privateIp';
export type EditFormErrors = Record<EditFormField, string | null>;

type EditFormState = {
  displayName: string;
  licenseType: string;
  externalIp: string;
  privateIp: string;
};

/** Un champ dont la valeur saisie diffère de la valeur installée sur le serveur. */
export type EditFormChange = {
  field: 'displayName' | 'licenseType' | 'externalIp' | 'privateIp';
  before: string;
  after: string;
};

/**
 * Formulaire de la modale d'édition d'un serveur VBR (BKP-1218), sur le modèle de
 * `useOrderForm` mais sans étapes ni persistance : la modale est ouverte/fermée par le
 * routeur, rien à survivre à un refresh.
 */
export function useEditBackupServerForm(server?: BackupServerResource) {
  const [form, setForm] = useState<EditFormState | null>(null);
  const [touched, setTouched] = useState<Set<EditFormField>>(new Set());
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Seeding unique depuis la donnée serveur, ajusté pendant le rendu plutôt que dans un effet
  // (cf. https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes) :
  // `form` reste `null` tant qu'elle n'est pas chargée, puis se fige à sa première valeur pour
  // ne pas écraser la saisie de l'utilisateur au refetch suivant (polling, invalidation d'une
  // autre mutation, etc.).
  if (server && form === null) {
    setForm({
      displayName: server.currentState.displayName,
      licenseType: server.currentState.licenseType ?? '',
      externalIp: firstIpWithoutMask(server.currentState.externalIps),
      privateIp: firstIpWithoutMask(server.currentState.privateIps),
    });
  }

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

    if (!form) {
      return { displayName: null, externalIp: null, privateIp: null };
    }

    return {
      displayName: requiredError('displayName', form.displayName, 'edit.field.name.error'),
      externalIp: ipError('externalIp', form.externalIp, 'edit.field.public_ip.error'),
      privateIp: ipError('privateIp', form.privateIp, 'edit.field.private_ip.error'),
    };
  }, [form, touched, submitAttempted]);

  const isValid = useMemo(() => {
    if (!form) return false;
    return (
      form.displayName.trim() !== '' &&
      isValidIp(form.externalIp) &&
      isValidIp(form.privateIp) &&
      form.licenseType.trim() !== ''
    );
  }, [form]);

  // Récap « avant / après » (reconnaissance plutôt que rappel) : ne liste que les champs
  // effectivement modifiés, comparés à la valeur installée sur le serveur — pas à une valeur
  // par défaut arbitraire.
  const changes = useMemo<EditFormChange[]>(() => {
    if (!form || !server) return [];

    const candidates: (EditFormChange | null)[] = [
      form.displayName !== server.currentState.displayName
        ? { field: 'displayName', before: server.currentState.displayName, after: form.displayName }
        : null,
      form.externalIp !== firstIpWithoutMask(server.currentState.externalIps)
        ? {
            field: 'externalIp',
            before: firstIpWithoutMask(server.currentState.externalIps),
            after: form.externalIp,
          }
        : null,
      form.privateIp !== firstIpWithoutMask(server.currentState.privateIps)
        ? {
            field: 'privateIp',
            before: firstIpWithoutMask(server.currentState.privateIps),
            after: form.privateIp,
          }
        : null,
      form.licenseType !== (server.currentState.licenseType ?? '')
        ? {
            field: 'licenseType',
            before: server.currentState.licenseType ?? '',
            after: form.licenseType,
          }
        : null,
    ];

    return candidates.filter((change): change is EditFormChange => change !== null);
  }, [form, server]);

  return {
    form,
    errors,
    isValid,
    changes,
    setField,
    touchField,
    submitAttempted,
    setSubmitAttempted,
  };
}

export type UseEditBackupServerFormReturn = ReturnType<typeof useEditBackupServerForm>;
