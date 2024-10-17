export interface PCIAi {
  projectId: string;
}

export class AIError extends Error {
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
    this.name = 'AIError';
    this.code = code;
    this.request = request;
    this.response = {
      data: responseData,
      status,
      statusText,
    };
  }
}
