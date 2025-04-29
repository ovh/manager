import '@/alldoms/setupTests';
import { findContact } from '@/alldoms/utils/utils';
import { serviceInfoDetail } from '@/alldoms/__mocks__/serviceInfoDetail';
import { ServiceInfoContactEnum } from '@/alldoms/enum/service.enum';

test('display the correct contact', () => {
  expect(
    findContact(
      serviceInfoDetail.serviceInfo.customer.contacts,
      ServiceInfoContactEnum.Administrator,
    ),
  ).toEqual('aa00001-ovh');
});
