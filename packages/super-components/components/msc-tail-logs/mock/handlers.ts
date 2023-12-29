import log1 from './v6/log1.json';
import log2 from './v6/log2.json';
import log3 from './v6/log3.json';
import emptyLogs from './v6/empty-log.json';
import { toMswHandlers, Handler } from '../../../_common/msw-helpers';

export const config: Handler[] = [
  {
    url:
      'cloud/project/11111111111111111111/database/mongodb/11111111-11111-111111-1111111111/logs*',
    response: log1,
  },
  {
    url:
      'cloud/project/22222222222222222222/database/mongodb/22222222-22222-222222-2222222222/logs*',
    response: log2,
  },
  {
    url:
      'cloud/project/33333333333333333333/database/mongodb/33333333-33333-333333-3333333333/logs*',
    response: log3,
  },
  {
    url: 'cloud/project/emptylogs/*',
    response: emptyLogs,
  },
  {
    url: 'cloud/project/servererror/*',
    status: 500,
    response: [],
  },
];

export default toMswHandlers(config);
