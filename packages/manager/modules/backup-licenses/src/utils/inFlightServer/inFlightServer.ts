import { BackupServerResource } from '@/types/BackupServer.type';
import { CurrentTask, TaskStatus } from '@/types/Resource.type';

/**
 * Statuts d'une tâche qui va encore évoluer d'elle-même : ce sont les seuls qui justifient
 * un rafraîchissement automatique. `ERROR` (tâche terminée en échec) et `WAITING_USER_INPUT`
 * (en attente d'une action de l'utilisateur) en sont exclus : poller n'y changera rien.
 */
const PROGRESSING_TASK_STATUSES: TaskStatus[] = ['PENDING', 'RUNNING', 'SCHEDULED'];

/**
 * Un `status` absent ou `null` est traité comme progressif : c'est le cas d'une tâche
 * tout juste créée dont le back-end n'a pas encore posé le statut. Le garde-fou de
 * `POLLING_TIMEOUT_MS` borne le risque si cette hypothèse est fausse.
 */
const isTaskProgressing = (task: CurrentTask): boolean =>
  task.status == null || PROGRESSING_TASK_STATUSES.includes(task.status);

/**
 * Une opération asynchrone est réellement en cours sur la ressource (BKP-1220).
 *
 * On ne peut pas se contenter de `currentTasks` non vide : une tâche en `ERROR` y reste
 * après son échec. La compter comme « en cours » ferait poller 5 min pour rien, afficherait
 * le message de timeout à tort, puis laisserait la ligne bloquée — spinner perpétuel et
 * actions désactivées, donc impossible de relancer l'opération qui a échoué.
 */
export const isServerInFlight = (server: BackupServerResource): boolean =>
  (server.currentTasks ?? []).some(isTaskProgressing);

/** Au moins une opération a échoué sur la ressource → rendu d'erreur, actions réouvertes. */
export const hasFailedTask = (server: BackupServerResource): boolean =>
  (server.currentTasks ?? []).some((task) => task.status === 'ERROR');

export const hasInFlightServers = (servers?: BackupServerResource[]): boolean =>
  (servers ?? []).some(isServerInFlight);
