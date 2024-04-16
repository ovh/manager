export interface ServicesCount {
    total: number;
    serviceTypes: Record<string, number>;
    errors?: Array<ServicesCountError>;
  }

  interface ServicesCountError {
    url: string;
    status: number;
    message: string;
  }
  