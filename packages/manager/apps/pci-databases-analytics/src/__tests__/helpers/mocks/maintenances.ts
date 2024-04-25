import { database } from '@/models/database';

export const mockedMaintenance: database.service.Maintenance = {
  description: 'description',
  id: 'maintenanceId',
  scheduledAt: 'scheduleDate',
  appliedAt: 'appliedDate',
  status: database.service.maintenance.StatusEnum.APPLYING,
};

export const mockedMaintenanceBis: database.service.Maintenance = {
  description: 'description',
  id: 'maintenanceId',
  scheduledAt: 'scheduleDate',
  appliedAt: 'appliedDate',
  status: database.service.maintenance.StatusEnum.PENDING,
};

export const mockedMaintenanceTer: database.service.Maintenance = {
  description: 'description',
  id: 'maintenanceId',
  scheduledAt: 'scheduleDate',
  appliedAt: 'appliedDate',
  status: database.service.maintenance.StatusEnum.SCHEDULED,
};
