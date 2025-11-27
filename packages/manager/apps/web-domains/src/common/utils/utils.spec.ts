import '@/common/setupTests';
import { findContact } from '@/common/utils/utils';
import { serviceInfo } from '@/alldoms/__mocks__/serviceInfo';
import { ServiceInfoContactEnum } from '@/common/enum/common.enum';

test('display the correct contact', () => {
  expect(
    findContact(
      serviceInfo.customer.contacts,
      ServiceInfoContactEnum.Administrator,
    ),
  ).toEqual('aa00001-ovh');
});
