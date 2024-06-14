import { AxiosError, AxiosResponse } from 'axios';
import { Status2fa } from '@/types/status.type';

// TODO: Replace this mock with a real call 'me/procedure/2fa'
export const get2faStatus: (result: string) => Promise<Status2fa> = (
  result: string,
) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let error = null;
      switch (result) {
        case '0':
          resolve({
            status: 'open',
            ticketId: 'fakeTicketId',
          });
          break;
        case '1':
          error = new Error('fake error');
          (error as AxiosError).response = {
            status: 404,
            data: { class: 'Client::ErrNotFound::ErrNotFound' },
          } as AxiosResponse;
          reject(error);
          break;
        default:
          error = new Error('fake error');
          (error as Error & { reason: number }).reason = 0;
          reject(error);
          break;
      }
    }, 300);
  });
};
