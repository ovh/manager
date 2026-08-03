import { describe, expect, it } from 'vitest';

import { BackupServerResource } from '@/types/BackupServer.type';
import { CurrentTask, TaskStatus } from '@/types/Resource.type';

import {
  hasFailedTask,
  hasInFlightServers,
  isServerBeingDeleted,
  isServerInFlight,
} from './inFlightServer';

const buildTask = (
  status: TaskStatus | null,
  id = 'task-1',
  type = 'BACKUP_LICENSES_SERVER_LICENSE_CHANGE',
): CurrentTask => ({
  id,
  link: `/me/task/${id}`,
  status,
  type,
});

const task = buildTask('SCHEDULED');

const buildServer = (id: string, currentTasks: CurrentTask[]): BackupServerResource => ({
  id,
  status: 'ENABLED',
  currentState: { id, displayName: id },
  currentTasks,
});

describe('isServerInFlight', () => {
  it.each<TaskStatus | null>(['PENDING', 'RUNNING', 'SCHEDULED', null])(
    'returns true for a %s task',
    (status) => {
      expect(isServerInFlight(buildServer('server-1', [buildTask(status)]))).toBe(true);
    },
  );

  // Régression : une tâche en échec reste dans `currentTasks`. La compter comme « en cours »
  // faisait poller 5 min pour rien, affichait le message de timeout à tort et laissait la
  // ligne bloquée (spinner perpétuel, actions désactivées).
  it.each<TaskStatus>(['ERROR', 'WAITING_USER_INPUT'])(
    'returns false for a %s task, which will not progress on its own',
    (status) => {
      expect(isServerInFlight(buildServer('server-1', [buildTask(status)]))).toBe(false);
    },
  );

  it('returns true when a failed task coexists with a progressing one', () => {
    const server = buildServer('server-1', [buildTask('ERROR', 'task-1'), buildTask('RUNNING')]);

    expect(isServerInFlight(server)).toBe(true);
  });

  it('returns false when currentTasks is empty', () => {
    expect(isServerInFlight(buildServer('server-1', []))).toBe(false);
  });

  it('returns false when currentTasks is missing from the payload', () => {
    const server = { ...buildServer('server-1', []), currentTasks: undefined };

    expect(isServerInFlight(server as unknown as BackupServerResource)).toBe(false);
  });
});

describe('hasFailedTask', () => {
  it('returns true when at least one task is in ERROR', () => {
    const server = buildServer('server-1', [buildTask('RUNNING'), buildTask('ERROR', 'task-2')]);

    expect(hasFailedTask(server)).toBe(true);
  });

  it.each<TaskStatus | null>(['PENDING', 'RUNNING', 'SCHEDULED', 'WAITING_USER_INPUT', null])(
    'returns false for a %s task',
    (status) => {
      expect(hasFailedTask(buildServer('server-1', [buildTask(status)]))).toBe(false);
    },
  );

  it('returns false when currentTasks is empty', () => {
    expect(hasFailedTask(buildServer('server-1', []))).toBe(false);
  });
});

describe('isServerBeingDeleted', () => {
  it('returns true when a progressing task is of a delete type', () => {
    const server = buildServer('server-1', [
      buildTask('SCHEDULED', 'task-1', 'BACKUP_LICENSES_SERVER_DELETE'),
    ]);

    expect(isServerBeingDeleted(server)).toBe(true);
  });

  it('returns false when the progressing task is not a delete', () => {
    const server = buildServer('server-1', [buildTask('RUNNING')]);

    expect(isServerBeingDeleted(server)).toBe(false);
  });

  // Régression : une suppression déjà terminée en échec ne doit pas garder le libellé
  // « suppression en cours » — priorité à `hasFailedTask` côté rendu.
  it('returns false when the only delete task is in ERROR', () => {
    const server = buildServer('server-1', [
      buildTask('ERROR', 'task-1', 'BACKUP_LICENSES_SERVER_DELETE'),
    ]);

    expect(isServerBeingDeleted(server)).toBe(false);
  });

  it('returns false when currentTasks is empty', () => {
    expect(isServerBeingDeleted(buildServer('server-1', []))).toBe(false);
  });
});

describe('hasInFlightServers', () => {
  it('returns true when at least one server has a progressing task', () => {
    expect(hasInFlightServers([buildServer('a', []), buildServer('b', [task])])).toBe(true);
  });

  it('returns false when no server has a current task', () => {
    expect(hasInFlightServers([buildServer('a', []), buildServer('b', [])])).toBe(false);
  });

  it('returns false when the only task left is in ERROR', () => {
    const servers = [buildServer('a', []), buildServer('b', [buildTask('ERROR')])];

    expect(hasInFlightServers(servers)).toBe(false);
  });

  it.each([undefined, []])('returns false for %s', (servers) => {
    expect(hasInFlightServers(servers)).toBe(false);
  });
});
