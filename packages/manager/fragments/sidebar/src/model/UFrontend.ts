import Environment from './Environment';

export interface UFrontEnd {
  getEnvironment: () => Environment,
  buildURL: (application: string, path: string, params?: Record<string, any>) => string
}

export default Service;
