import { database } from '@/models/database';

export const mockedMaintenance: database.service.Maintenance = {
  description: 'description',
  id: 'maintenanceId',
  scheduledAt: 'scheduleDate',
  appliedAt: 'appliedDate',
  status: database.service.maintenance.StatusEnum.APPLYING,
};
