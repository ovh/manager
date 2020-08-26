import { UFrontEnd } from '@/model/UFrontend';

let _ufrontend: UFrontEnd;

export const setUFrontend = (ufrontend: UFrontEnd): void => {
  _ufrontend = ufrontend
}

export const useUFrontendBuildURL = (app: string, path: string, params?: Record<string, any>): string | undefined => _ufrontend?.buildURL(app, path, params)

export default {
  setUFrontend,
  useUFrontendBuildURL
}
