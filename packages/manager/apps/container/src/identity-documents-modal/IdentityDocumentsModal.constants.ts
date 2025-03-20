import { v6 } from '@ovh-ux/manager-core-api';
import { ModalToDisplayConfiguration } from '@/types/modal-configuration.type';
import { IdentityDocumentsModal } from '@/identity-documents-modal/IdentityDocumentsModal';

export const kycIndiaFeature = 'identity-documents';
export const requiredStatusKey = 'required';
export const trackingPrefix = 'Hub::account::identity-files';
export const trackingContext = {
  chapter1: 'Hub',
  chapter2: 'account',
  chapter3: 'identity-files',
  level2: '88',
};

export const IdentityDocumentsModalConfiguration: ModalToDisplayConfiguration = {
  checks: {
    userCheck: (user) => !user.kycValidated,
    featuresAvailability: [kycIndiaFeature],
    intervalInSeconds: Infinity,
  },
  data: {
    queryParams: {
      queryKey: ['identity-documents-status'],
      queryFn: async () => {
        const { data } = await v6<{ status: string }>('/me/procedure/identity');
        return data;
      },
      retry: 1,
      refetchOnWindowFocus: false,
    },
    check: (data: { status: string }) => {
      return data?.status === requiredStatusKey;
    },
  },
  component: IdentityDocumentsModal,
};
