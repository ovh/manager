import { toMswHandlers, Handler } from '../../../_common/msw-helpers';
import vpsAdvices from './2api/vps-advices.json';
import domainAdvices from './2api/domain-advices.json';

export const config: Handler[] = [
  {
    url: 'advices/vps/vps-abcd1234.vps.ovh.net',
    response: vpsAdvices,
    api: 'aapi',
  },
  {
    url: 'advices/domain-web/abcd1234.fr',
    response: domainAdvices,
    api: 'aapi',
  },
];

export default toMswHandlers(config);
