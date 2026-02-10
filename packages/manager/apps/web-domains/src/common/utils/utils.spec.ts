import '@/common/setupTests';
import { findContact, handleOrderClick } from '@/common/utils/utils';
import { serviceInfo } from '@/alldoms/__mocks__/serviceInfo';
import { ServiceInfoContactEnum } from '@/common/enum/common.enum';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('utils', () => {
  describe('findContact', () => {
    it('should return the correct contact customerCode', () => {
      expect(
        findContact(
          serviceInfo.customer.contacts,
          ServiceInfoContactEnum.Administrator,
        ),
      ).toEqual('aa00001-ovh');
    });

    it('should return null if contact not found', () => {
      expect(findContact([], ServiceInfoContactEnum.Administrator)).toBeNull();
    });
  });

  describe('handleOrderClick', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should open order URL in a new tab', () => {
      const orderUrl = 'https://order.eu.ovhcloud.com/fr';
      handleOrderClick(orderUrl);

      expect(window.open).toHaveBeenCalledWith(
        orderUrl,
        '_blank',
        'noopener,noreferrer',
      );
    });
  });
});
