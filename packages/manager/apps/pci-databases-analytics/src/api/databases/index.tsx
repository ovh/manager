import { database } from '@/models/database';

export interface PCIData {
  projectId: string;
}
export interface ServiceData extends PCIData {
  engine: database.EngineEnum;
  serviceId: string;
}

export interface CdbError extends Error {
  code: string;
  message: string;
  request: XMLHttpRequest;
  response: {
    data: {
      class: string;
      message: string;
      details: {
        message: string;
      };
    };
    status: number;
    statusText: string;
  };
}
