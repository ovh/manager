import * as database from '@/types/cloud/project/database';

export const mockedMaintenance: database.service.Maintenance = {
  description: 'maintenance description',
  id: 'maintenanceId',
  scheduledAt: '05/05/2022',
  status: database.service.maintenance.StatusEnum.APPLYING,
};

export const mockedMaintenanceBis: database.service.Maintenance = {
  description: 'description',
  id: 'maintenanceId',
  scheduledAt: '05/05/2022',
  appliedAt: '',
  status: database.service.maintenance.StatusEnum.PENDING,
};

export const mockedMaintenanceTer: database.service.Maintenance = {
  description: 'descriptionMaintenace',
  id: 'maintenanceId',
  scheduledAt: '05/05/2022',
  appliedAt: '',
  status: database.service.maintenance.StatusEnum.SCHEDULED,
};
