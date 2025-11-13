export const HeadersNoCache = {
  Pragma: 'no-cache',
};
export const HeadersIcebergPagination = {
  'X-Pagination-Mode': 'CachedObjectList-Pages',
  'X-Pagination-Size': '50000',
  ...HeadersNoCache,
};

export const HeaderXAuthToken = 'X-Auth-Token';

export interface PCIData {
  projectId: string;
}

export class ObjStoError extends Error {
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
