import '@/alldoms/setupTests';
import { findContact } from '@/alldoms/utils/utils';
import { serviceInfoDetailObject } from '@/alldoms/__mocks__/serviceInfoDetail';
import { ServiceInfoContactEnum } from '@/alldoms/enum/service.enum';

test('display the correct contact', () => {
  expect(
    findContact(
      serviceInfoDetailObject.serviceInfo.customer.contacts,
      ServiceInfoContactEnum.Administrator,
    ),
  ).toEqual('aa00001-ovh');
});
