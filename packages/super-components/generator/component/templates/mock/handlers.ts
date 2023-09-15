import { toMswHandlers, Handler } from '../../../_common/msw-helpers';
import contactResponse from './v6/me-contact.json';

export const config: Handler[] = [
  {
    url: 'me/contact/:id',
    response: contactResponse,
  },
];

export default toMswHandlers(config);
