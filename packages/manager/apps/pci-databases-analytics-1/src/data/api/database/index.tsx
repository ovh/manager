import * as database from '@/types/cloud/project/database';

export interface PCIData {
  projectId: string;
}
export interface ServiceData extends PCIData {
  engine: database.EngineEnum;
  serviceId: string;
}

export class CdbError extends Error {
  code: string;

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

  constructor(
    code: string,
    message: string,
    request: XMLHttpRequest,
    responseData: any,
    status: number,
    statusText: string,
  ) {
    super(message);
    this.name = 'CdbError';
    this.code = code;
    this.request = request;
    this.response = {
      data: responseData,
      status,
      statusText,
    };
  }
}
