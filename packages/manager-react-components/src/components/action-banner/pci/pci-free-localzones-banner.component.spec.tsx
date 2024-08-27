import '@testing-library/jest-dom';
import { render } from '../../../utils/test.provider';
import {
  PciFreeLocalzonesBanner,
  URLs,
} from './pci-free-localzones-banner.component';

describe('PciFreeLocalzonesBanner tests', () => {
  it('should give documentation link depending of subsidiary', () => {
    {
      const { container } = render(
        <PciFreeLocalzonesBanner showConfirm={false} ovhSubsidiary="FR" />,
      );
      expect(container.querySelector('osds-link')).toHaveAttribute(
        'href',
        URLs.FR,
      );
    }
    {
      const { container } = render(
        <PciFreeLocalzonesBanner showConfirm={false} ovhSubsidiary="DE" />,
      );
      expect(container.querySelector('osds-link')).toHaveAttribute(
        'href',
        URLs.DE,
      );
    }
    {
      const { container } = render(
        <PciFreeLocalzonesBanner showConfirm={false} ovhSubsidiary="" />,
      );
      expect(container.querySelector('osds-link')).toHaveAttribute(
        'href',
        URLs.DEFAULT,
      );
    }
  });
});
