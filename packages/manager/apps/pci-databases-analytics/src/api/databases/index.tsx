import { database } from '@/models/database';

export interface PCIData {
  projectId: string;
}
export interface ServiceData extends PCIData {
  engine: database.EngineEnum;
  serviceId: string;
}
