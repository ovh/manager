import { TaskState } from './datacloud';

export interface LogForwarder {
  createdBy: string | null;
  createdFrom: string | null;
  datacenterId: number | null;
  description: string | null;
  endDate: string | null;
  executionDate: string;
  filerId: number | null;
  hostId: number | null;
  lastModificationDate: string | null;
  maintenanceDateFrom: string | null;
  maintenanceDateTo: string | null;
  name: string;
  network: string | null;
  networkAccessId: number | null;
  orderId: number | null;
  parentTaskId: number | null;
  progress: number;
  state: TaskState;
  taskId: number;
  type: string;
  userId: number | null;
  vlanId: number | null;
}
