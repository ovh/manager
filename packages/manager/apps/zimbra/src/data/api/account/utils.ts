import { AddEmailAccountSchema } from '@/utils';
import { AccountBodyParamsType } from './type';

export const formatAccountPayload = (
  data: AddEmailAccountSchema,
  isEdit = false,
): AccountBodyParamsType => {
  const { account, domain } = data;

  const payload: Record<string, unknown> = {
    email: `${account}@${domain}`.toLowerCase(),
  };

  Object.entries(data).forEach(([key, value]) => {
    if (
      ![
        'account',
        'domain',
        isEdit ? 'password' : '',
        'offer' /* @TODO remove when backend accept this */,
      ].includes(key)
    ) {
      payload[key] = value;
    }
  });

  return payload as AccountBodyParamsType;
};
