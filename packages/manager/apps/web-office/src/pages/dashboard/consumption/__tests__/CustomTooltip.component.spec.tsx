import '@testing-library/jest-dom';
import { fr } from 'date-fns/locale';
import { describe, expect, it } from 'vitest';

import consumptionTranslation from '@/public/translations/dashboard/consumption/Messages_fr_FR.json';
import { renderWithRouter } from '@/utils/Test.provider';

import CustomTooltip from '../CustomTooltip.component';

const testPayload = [
  {
    payload: {
      rawDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
      officeBusiness: 5,
      officeProPlus: 10,
    },
  },
];

describe('CustomTooltip', () => {
  it('load data on tooltip', () => {
    const { getByTestId } = renderWithRouter(<CustomTooltip locale={fr} payload={testPayload} />);

    const relativeDate = getByTestId('relative-date');
    const officeBusiness = getByTestId('officeBusiness');
    const officeProPlus = getByTestId('officeProPlus');
    expect(relativeDate).toHaveTextContent('il y a 1 jour');
    expect(officeBusiness).toHaveTextContent(consumptionTranslation.officeBusiness_serie_name);
    expect(officeProPlus).toHaveTextContent(consumptionTranslation.officeProPlus_serie_name);
  });
  it('return null when payload is undifined', () => {
    const { container } = renderWithRouter(<CustomTooltip locale={fr} payload={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('Consumption W3C Validation', () => {
  it('should have a valid html', async () => {
    const { container } = renderWithRouter(<CustomTooltip locale={fr} payload={testPayload} />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
