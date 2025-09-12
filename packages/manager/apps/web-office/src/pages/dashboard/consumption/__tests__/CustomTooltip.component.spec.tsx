import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { fr } from 'date-fns/locale';
import { describe, expect, it } from 'vitest';

import CustomTooltip from '../CustomTooltip.component';

describe('CustomTooltip', () => {
  it('load data on tooltip', () => {
    const testPayload = [
      {
        payload: {
          rawDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
          officeBusiness: 5,
          officeProPlus: 10,
        },
      },
    ];

    const { getByTestId } = render(<CustomTooltip locale={fr} payload={testPayload} />);

    const relativeDate = getByTestId('relative-date');
    const officeBusiness = getByTestId('officeBusiness');
    const officeProPlus = getByTestId('officeProPlus');
    expect(relativeDate).toHaveTextContent('il y a 1 jour');
    expect(officeBusiness).toHaveTextContent('officeBusiness_serie_name');
    expect(officeProPlus).toHaveTextContent('officeProPlus_serie_name');
  });
  it('return null when payload is undifined', () => {
    const { container } = render(<CustomTooltip locale={fr} payload={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
