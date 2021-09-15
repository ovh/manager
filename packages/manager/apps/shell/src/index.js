import { fetchConfiguration } from '@ovh-ux/manager-config';

import appContext from './context';

import './index.scss';

fetchConfiguration('shell')
  .then((environment) => appContext.setEnvironment(environment))
  .then(() => import('./ShellHeader.jsx'));
