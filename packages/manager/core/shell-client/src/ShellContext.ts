import { Environment } from '@ovh-ux/manager-config';
import { ShellClientApi, RegionsTrackingConfig } from '@ovh-ux/shell';
import { createContext } from 'react';

export type TrackingContextParams = {
  chapter1?: string;
  chapter2?: string;
  chapter3?: string;
  pageTheme?: string;
  level2?: string;
  appName?: string;
  level2Config?: RegionsTrackingConfig;
};

export type ShellContextType = {
  shell: ShellClientApi;
  environment: Environment;
  tracking?: TrackingContextParams;
};

export const ShellContext = createContext<ShellContextType>({
  shell: null,
  environment: null,
  tracking: null,
});

export default ShellContext;
