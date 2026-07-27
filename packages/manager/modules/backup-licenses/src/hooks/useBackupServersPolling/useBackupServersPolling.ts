import { useCallback, useEffect, useState } from 'react';

import { POLLING_INTERVAL_MS, POLLING_TIMEOUT_MS } from '@/module.constants';
import { BackupServerResource } from '@/types/BackupServer.type';
import { hasInFlightServers } from '@/utils/inFlightServer/inFlightServer';

export type UseBackupServersPollingResult = {
  /** Valeur à passer au `refetchInterval` du `useQuery` de la liste. */
  refetchInterval: number | false;
  /** Vrai quand la séquence d'opérations dépasse `POLLING_TIMEOUT_MS`. */
  hasTimedOut: boolean;
  /** Réarme la séquence de polling (bouton « Rafraîchir »). */
  resetPolling: () => void;
};

/**
 * Polling des opérations asynchrones (BKP-1220).
 *
 * Piloté par la donnée et non par l'événement de mutation : on polle dès qu'au moins une
 * ligne porte une tâche en cours. Ça couvre aussi l'arrivée depuis le tunnel de commande et
 * le rechargement de page en cours de provisionnement, qu'un déclencheur événementiel
 * perdrait. Les mutations à venir (2.2/2.3/2.4) n'auront qu'à invalider la query.
 *
 * React Query gère seul le démarrage et l'arrêt via `refetchInterval` : pas de `setInterval`
 * maison. Le seul minuteur ici est le garde-fou de 5 min, armé à la transition
 * « aucune tâche → au moins une tâche ».
 */
export const useBackupServersPolling = (
  servers?: BackupServerResource[],
): UseBackupServersPollingResult => {
  const [hasTimedOut, setHasTimedOut] = useState(false);
  // Incrémenté par « Rafraîchir » : change la séquence courante, donc réarme le garde-fou.
  const [sequence, setSequence] = useState(0);
  const isPolling = hasInFlightServers(servers);

  useEffect(() => {
    if (!isPolling) return undefined;

    const timer = setTimeout(() => setHasTimedOut(true), POLLING_TIMEOUT_MS);
    return () => {
      clearTimeout(timer);
      // La séquence s'achève (plus aucune tâche) ou est réarmée : on oublie son timeout.
      setHasTimedOut(false);
    };
  }, [isPolling, sequence]);

  const resetPolling = useCallback(() => setSequence((current) => current + 1), []);

  return {
    refetchInterval: isPolling && !hasTimedOut ? POLLING_INTERVAL_MS : false,
    hasTimedOut,
    resetPolling,
  };
};
