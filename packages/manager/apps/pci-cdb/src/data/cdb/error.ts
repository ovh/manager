export interface CdbError {
  code: string;
  message: string;
  request: XMLHttpRequest;
  response: {
    data: {
      class: string;
      message: string;
    };
    status: number;
    statusText: string;
  };
}
