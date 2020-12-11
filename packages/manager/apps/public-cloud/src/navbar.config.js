import { Environment } from '@ovh-ux/manager-config';

export default {
  toggle: {
    event: 'sidebar:loaded',
  },
  universe: Environment.getUniverse(),
};
