import { Status2fa } from '@/interfaces';

// TODO: Replace this mock with a real call 'me/procedure/2fa'
export const get2faStatus: () => Promise<Status2fa> = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: Math.random() >= 0.5 ? 'creationAuthorized' : 'open',
        ticketId: '',
      });
    }, 300);
  });
};
