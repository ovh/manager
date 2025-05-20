import { AddEmailAccountSchema } from '@/utils';
import { AccountBodyParamsType } from './type';

export const formatAccountPayload = (
  data: AddEmailAccountSchema,
  isEdit = false,
): AccountBodyParamsType => {
  const { account, domain, slotId } = data;

  const payload: Record<string, unknown> = {
    email: `${account}@${domain}`.toLowerCase(),
  };

  Object.entries(data).forEach(([key, value]) => {
    if (
      ![
        'account',
        'domain',
        isEdit ? 'password' : '',
        isEdit || !slotId ? 'slotId' : '',
        isEdit ? 'offer' : '', // @TODO: remove when backend make this optional
      ].includes(key)
    ) {
      payload[key] = value;
    }
  });

  return payload as AccountBodyParamsType;
};
