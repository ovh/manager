import { describe, expect, it, test, vi } from 'vitest';
import { usePackTypeLabel } from './usePackLabel';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => `${translationKey}_translated`,
    i18n: {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

describe('get service key type translation ', () => {
  const useCases: {
    type: string;
    label: string;
  }[] = [
    {
      type: 'hycu-cloud-vm-pack-25',
      label: '25 VMs',
    },
    {
      type: 'hycu-cloud-vm-pack-250',
      label: '250 VMs',
    },
  ];
  test.each(useCases)(
    'should return the right translation key for $type',
    ({ type, label }) => {
      // given type and translationKey
      // when
      const result = usePackTypeLabel(type);
      // then
      expect(result).toBe(label);
    },
  );
  it('should return type if unexpected value', () => {
    // given
    const type = 'hycu-cloud-vm-pack-123';
    // when
    const result = usePackTypeLabel(type);

    // then
    expect(result).toBe('hycu_cloud_vm_pack_unknown_translated');
  });
});
