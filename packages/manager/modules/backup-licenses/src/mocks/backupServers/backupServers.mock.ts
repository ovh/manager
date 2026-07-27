/**
 * Jeux de données de développement pour la liste des serveurs VBR.
 * Base : l'exemple de réponse réel fourni par le BE le 27/07/2026 (§16 de la spec BKP-1216),
 * complété pour couvrir les 5 valeurs de `licenseStatus`, un `licenseStatus: null`
 * et un serveur sans IP / version / OS.
 * À supprimer une fois l'endpoint déployé (cf. §15 de la spec).
 */
import { BackupServerResource, LicenseStatus } from '@/types/BackupServer.type';
import { LicenseApiValue } from '@/types/Order.type';

export const mockBackupServers: BackupServerResource[] = [
  // Changement de licence en cours : `currentTasks` non vide et licenseType ≠ licenseTypeRequested.
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    status: 'ENABLED',
    targetSpec: {
      displayName: 'VBR-CUST-SERV-01',
      licenseType: LicenseApiValue.VDP_ADVANCED,
      privateIps: ['192.168.10.2/32'],
      externalIps: ['203.0.113.10/32'],
    },
    currentState: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      displayName: 'VBR-CUST-SERV-01',
      privateIps: ['192.168.10.2/32'],
      externalIps: ['203.0.113.10/32'],
      licenseTypeRequested: LicenseApiValue.VDP_ADVANCED,
      licenseType: LicenseApiValue.VDP_PREMIUM,
      backupServerVersion: '12.1',
      licenseStatus: LicenseStatus.INSTALLED,
      managementAgentStatus: 'INSTALLED',
      osType: 'WINDOWS',
    },
    currentTasks: [
      {
        id: 'cc0e8400-e29b-41d4-a716-446655440008',
        link: '/me/task/cc0e8400-e29b-41d4-a716-446655440008',
        status: 'SCHEDULED',
        type: 'BACKUP_LICENSES_SERVER_LICENSE_CHANGE',
      },
    ],
    createdAt: '2026-05-01T12:00:00Z',
    updatedAt: '2026-05-05T09:30:00Z',
  },
  // Serveur au repos.
  {
    id: '44665544-a716-41d4-8e9b-550e84000002',
    status: 'ENABLED',
    targetSpec: {
      displayName: 'VBR-CUST-SERV-02',
      licenseType: LicenseApiValue.VDP_FOUNDATION,
      privateIps: ['10.100.10.2/32'],
      externalIps: ['203.0.113.25/32'],
    },
    currentState: {
      id: '44665544-a716-41d4-8e9b-550e84000002',
      displayName: 'VBR-CUST-SERV-02',
      privateIps: ['10.100.10.2/32'],
      externalIps: ['203.0.113.25/32'],
      licenseTypeRequested: LicenseApiValue.VDP_FOUNDATION,
      licenseType: LicenseApiValue.VDP_FOUNDATION,
      backupServerVersion: '12.1',
      licenseStatus: LicenseStatus.INSTALLED,
      managementAgentStatus: 'INSTALLED',
      osType: 'WINDOWS',
    },
    currentTasks: [],
    createdAt: '2026-05-01T12:00:00Z',
    updatedAt: '2026-05-05T09:30:00Z',
  },
  // Serveur en cours d'enregistrement : aucune IP, ni version, ni OS, `licenseStatus` absent.
  {
    id: '44665544-a716-41d4-8e9b-550e84000003',
    status: 'ENABLED',
    currentState: {
      id: '44665544-a716-41d4-8e9b-550e84000003',
      displayName: 'VBR-CUST-SERV-03',
      licenseType: LicenseApiValue.ENTERPRISE_PLUS,
    },
    currentTasks: [
      {
        id: 'cc0e8400-e29b-41d4-a716-446655440009',
        link: '/me/task/cc0e8400-e29b-41d4-a716-446655440009',
        status: 'RUNNING',
        type: 'BACKUP_LICENSES_SERVER_CREATE',
      },
    ],
    createdAt: '2026-05-01T12:00:00Z',
    updatedAt: '2026-05-05T09:30:00Z',
  },
  // Licence en cours de création.
  {
    id: '44665544-a716-41d4-8e9b-550e84000004',
    status: 'ENABLED',
    currentState: {
      id: '44665544-a716-41d4-8e9b-550e84000004',
      displayName: 'VBR-CUST-SERV-04',
      privateIps: ['10.100.10.4/32'],
      externalIps: ['203.0.113.0/24'],
      licenseType: LicenseApiValue.VDP_ADVANCED,
      licenseStatus: LicenseStatus.CREATING,
      backupServerVersion: '13.0',
      osType: 'LINUX',
    },
    currentTasks: [],
    createdAt: '2026-05-01T12:00:00Z',
    updatedAt: '2026-05-05T09:30:00Z',
  },
  // Licence en cours de mise à jour, et deux IP privées (affichage joint par « , »).
  {
    id: '44665544-a716-41d4-8e9b-550e84000005',
    status: 'ENABLED',
    currentState: {
      id: '44665544-a716-41d4-8e9b-550e84000005',
      displayName: 'VBR-CUST-SERV-05',
      privateIps: ['10.100.10.5/32', '10.100.20.5/32'],
      externalIps: ['203.0.113.55/32'],
      licenseType: LicenseApiValue.VDP_PREMIUM,
      licenseStatus: LicenseStatus.UPDATING,
      backupServerVersion: '13.0',
      osType: 'LINUX',
    },
    currentTasks: [],
    createdAt: '2026-05-01T12:00:00Z',
    updatedAt: '2026-05-05T09:30:00Z',
  },
  // Licence expirée.
  {
    id: '44665544-a716-41d4-8e9b-550e84000006',
    status: 'ENABLED',
    currentState: {
      id: '44665544-a716-41d4-8e9b-550e84000006',
      displayName: 'VBR-CUST-SERV-06',
      privateIps: ['10.100.10.6/32'],
      externalIps: ['2001:db8::6/128'],
      licenseType: LicenseApiValue.ENTERPRISE_PLUS,
      licenseStatus: LicenseStatus.EXPIRED,
      backupServerVersion: '12.1',
      osType: 'WINDOWS',
    },
    currentTasks: [],
    createdAt: '2026-05-01T12:00:00Z',
    updatedAt: '2026-05-05T09:30:00Z',
  },
  // Licence non prise en charge.
  {
    id: '44665544-a716-41d4-8e9b-550e84000007',
    status: 'ENABLED',
    currentState: {
      id: '44665544-a716-41d4-8e9b-550e84000007',
      displayName: 'VBR-CUST-SERV-07',
      privateIps: ['10.100.10.7/32'],
      externalIps: ['203.0.113.77/32'],
      licenseType: LicenseApiValue.VDP_FOUNDATION,
      licenseStatus: LicenseStatus.NOT_SUPPORTED,
      backupServerVersion: '11.0',
      osType: 'WINDOWS',
    },
    currentTasks: [],
    createdAt: '2026-05-01T12:00:00Z',
    updatedAt: '2026-05-05T09:30:00Z',
  },
  // `licenseStatus` explicitement null : traité comme CREATING (AC du ticket).
  {
    id: '44665544-a716-41d4-8e9b-550e84000008',
    status: 'ENABLED',
    currentState: {
      id: '44665544-a716-41d4-8e9b-550e84000008',
      displayName: 'VBR-CUST-SERV-08',
      privateIps: ['10.100.10.8/32'],
      externalIps: ['203.0.113.88/32'],
      licenseType: LicenseApiValue.VDP_ADVANCED,
      licenseStatus: null,
      backupServerVersion: '13.0',
      osType: 'LINUX',
    },
    currentTasks: [],
    createdAt: '2026-05-01T12:00:00Z',
    updatedAt: '2026-05-05T09:30:00Z',
  },
  // Création échouée : la tâche reste dans `currentTasks` avec `status: 'ERROR'` et
  // `licenseStatus` n'a jamais quitté `CREATING`. Ni polling, ni message de timeout :
  // badge « Erreur » et actions actives pour pouvoir relancer.
  {
    id: '44665544-a716-41d4-8e9b-550e84000009',
    status: 'ERROR',
    currentState: {
      id: '44665544-a716-41d4-8e9b-550e84000009',
      displayName: 'VBR-CUST-SERV-09',
      privateIps: ['10.100.10.9/32'],
      externalIps: ['203.0.113.99/32'],
      licenseType: LicenseApiValue.VDP_PREMIUM,
      licenseStatus: LicenseStatus.CREATING,
      backupServerVersion: '13.0',
      osType: 'WINDOWS',
    },
    currentTasks: [
      {
        id: 'cc0e8400-e29b-41d4-a716-446655440010',
        link: '/me/task/cc0e8400-e29b-41d4-a716-446655440010',
        status: 'ERROR',
        type: 'BACKUP_LICENSES_SERVER_CREATE',
      },
    ],
    createdAt: '2026-05-01T12:00:00Z',
    updatedAt: '2026-05-05T09:30:00Z',
  },
];
