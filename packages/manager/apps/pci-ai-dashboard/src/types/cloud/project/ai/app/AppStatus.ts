import { DataSync } from '@/types/cloud/project/ai/volume/DataSync';
import { AppStateHistory } from '@/types/cloud/project/ai/app/AppStateHistory';
import { Info } from '@/types/cloud/project/ai/Info';
import { Ip } from '@/types/Ip';
import { AppStateEnum } from '@/types/cloud/project/ai/app/AppStateEnum';
import { VolumeStatus } from '@/types/cloud/project/ai/volume/VolumeStatus';

/** AI Solutions App Status Object */
export interface AppStatus {
  /** Number of available replicas */
  availableReplicas?: number;
  /** Status about the datasync linked to the app */
  dataSync?: DataSync[];
  /** Address to reach when you want to access the App's gRPC services */
  grpcAddress?: string;
  /** Job state history */
  history?: AppStateHistory[];
  /** Information about the app */
  info?: Info;
  /** App info url */
  infoUrl?: string;
  /** Internal IP address of the app service */
  internalServiceIp?: Ip;
  /** Date of the last app state change */
  lastTransitionDate?: string;
  /** App resource usage url */
  monitoringUrl?: string;
  /** State of the app */
  state?: AppStateEnum;
  /** App access url */
  url?: string;
  /** App Data linked */
  volumes?: VolumeStatus[];
}
