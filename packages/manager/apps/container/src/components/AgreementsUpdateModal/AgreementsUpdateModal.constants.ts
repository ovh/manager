import { ModalToDisplayConfiguration } from '@/types/modal-configuration.type';
import AgreementsUpdateModal from '@/components/AgreementsUpdateModal/AgreementsUpdateModal.component';
import fetchPendingAgreements from '@/api/agreements';
import { Agreements } from '@/types/agreements';

export const AgreementsUpdateModalConfiguration: ModalToDisplayConfiguration = {
  checks: {
    iamRights: ['account:apiovh:me/agreements/accept'],
    featuresAvailability: ['billing:agreementsUpdateModal'],
    intervalInSeconds: 24 * 60 * 60,
    excludedUrls: [
      {
        appName: () => 'billing',
        appPath: () => '#/autorenew/agreements',
      },
    ],
  },
  data: {
    queryParams: {
      queryKey: ['pending-agreements'],
      queryFn: fetchPendingAgreements,
    },
    check: (data: Agreements[]) => data.length > 0,
  },
  component: AgreementsUpdateModal,
};
