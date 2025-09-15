import apiClient from '@ovh-ux/manager-core-api';
import {
  ContactMean,
  CreateContactMean,
  UpdateContactMean,
  ValidateContactMean,
} from '../types/contact-mean.type';

export const getContactMeanListQueryKey = () => ['/notification/contactMean'];
export const getContactMeanQueryKey = (contactMeanId: string) => [
  `/notification/contactMean/${contactMeanId}`,
];

export const createContactMean = async (data: CreateContactMean) => {
  const { data: responseData } = await apiClient.v2.post<ContactMean>(
    '/notification/contactMean',
    data,
  );
  return responseData;
};

export const deleteContactMean = async (contactMeanId: string) => {
  const { data: responseData } = await apiClient.v2.delete<ContactMean>(
    `/notification/contactMean/${contactMeanId}`,
  );
  return responseData;
};

export const updateContactMean = async ({
  contactMeanId,
  data,
}: {
  contactMeanId: string;
  data: UpdateContactMean;
}) => {
  const { data: responseData } = await apiClient.v2.put<ContactMean>(
    `/notification/contactMean/${contactMeanId}`,
    data,
  );
  return responseData;
};

export const validateContactMean = async (
  contactMeanId: string,
  data: ValidateContactMean,
) => {
  const { data: responseData } = await apiClient.v2.post<ContactMean>(
    `/notification/contactMean/${contactMeanId}/validate`,
    data,
  );
  return responseData;
};

export const restartValidationContactMean = async (contactMeanId: string) => {
  const { data: responseData } = await apiClient.v2.post<ContactMean>(
    `/notification/contactMean/${contactMeanId}/restartValidation`,
  );
  return responseData;
};

export const getContactMean = async (contactMeanId: string) => {
  const { data: responseData } = await apiClient.v2.get<ContactMean>(
    `/notification/contactMean/${contactMeanId}`,
  );
  return responseData;
};
