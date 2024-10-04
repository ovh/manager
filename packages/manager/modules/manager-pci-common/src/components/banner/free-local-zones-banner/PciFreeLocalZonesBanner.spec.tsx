import '@testing-library/jest-dom';
import { describe } from 'vitest';
import { render } from '@testing-library/react';
import { PciFreeLocalZonesBanner, URLs } from './PciFreeLocalZonesBanner';

describe('PciFreeLocalZonesBanner tests', () => {
  it.each(['FR', 'DE'])(
    'should give documentation link depending of subsidiary',
    (subsidiary) => {
      const { container } = render(
        <PciFreeLocalZonesBanner
          showConfirm={false}
          ovhSubsidiary={subsidiary}
        />,
      );

      expect(container.querySelector('osds-link')).toHaveAttribute(
        'href',
        URLs[subsidiary],
      );
    },
  );
});
