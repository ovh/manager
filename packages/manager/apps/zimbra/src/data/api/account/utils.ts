import { AddEmailAccountSchema } from '@/utils';

import { AccountBodyParamsType } from './type';

export const formatAccountPayload = (
  data: AddEmailAccountSchema,
  isEdit = false,
): AccountBodyParamsType => {
  const { account, domain, slotId, password, contactInformation } = data;
  const safeContactInformation = {
    service: contactInformation?.service ?? '',
    country: contactInformation?.country ?? '',
    company: contactInformation?.company ?? '',
    profession: contactInformation?.profession ?? '',
    office: contactInformation?.office ?? '',
    street: contactInformation?.street ?? '',
    mobileNumber: contactInformation?.mobileNumber ?? '',
    postcode: contactInformation?.postcode ?? '',
    city: contactInformation?.city ?? '',
    phoneNumber: contactInformation?.phoneNumber ?? '',
    faxNumber: contactInformation?.faxNumber ?? '',
  }; // @TODO: remove when backend make this optional

  const payload: Record<string, unknown> = {
    email: `${account}@${domain}`.toLowerCase(),
    contactInformation: safeContactInformation, // @TODO: remove when backend make this optional
  };

  Object.entries(data).forEach(([key, value]) => {
    if (
      ![
        'account',
        'domain',
        'contactInformation',
        isEdit && !password ? 'password' : '',
        isEdit || !slotId ? 'slotId' : '',
        isEdit ? 'offer' : '', // @TODO: remove when backend make this optional
      ].includes(key)
    ) {
      payload[key] = value;
    }
  });

  return payload as AccountBodyParamsType;
};
