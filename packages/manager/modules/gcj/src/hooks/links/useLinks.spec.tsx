import { describe, expect, it, vi } from 'vitest';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { useLink } from './useLinks';

const links = vi.hoisted(() => ({
  CA: 'https://ca.fake-link.com',
  FR: 'https://fr.fake-link.com',
  US: 'https://us.fake-link.com',
  DEFAULT: 'https://fr.fake-link.com',
}));

describe('useLinks', () => {
  describe('useLink', () => {
    it.each([
      ['FR', links.FR],
      ['CA', links.CA],
      ['US', links.US],
      ['GB', links.DEFAULT],
    ])(
      'should have the correct link for %s user speaking %s',
      async (sub, result) => {
        const link = useLink(links, sub as OvhSubsidiary);
        expect(link).toBe(result);
      },
    );
  });
});
