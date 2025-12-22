import '@testing-library/jest-dom';
import { fr } from 'date-fns/locale';
import { describe, expect, it, vi } from 'vitest';

import { renderWithRouter } from '@/utils/Test.provider';

import CustomTooltip from '../CustomTooltip.component';

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual<any>('react-i18next');

  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key, // so your expectations keep working
      i18n: { language: 'fr', changeLanguage: async () => {} },
    }),
  };
});

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
    expect(officeBusiness).toHaveTextContent('officeBusiness_serie_name');
    expect(officeProPlus).toHaveTextContent('officeProPlus_serie_name');
  });
  it('return null when payload is undifined', () => {
    const { container } = renderWithRouter(<CustomTooltip locale={fr} payload={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('Consumption W3C Validation', () => {
  /*
    FAIL  src/pages/dashboard/consumption/__tests__/CustomTooltip.component.spec.tsx > Consumption W3C Validation > should have a valid html
@ovh-ux/manager-web-office-app:test: Error: expected HTML to be valid, but got:
@ovh-ux/manager-web-office-app:test: :1.492-1.495: error: No “p” element in scope but a “p” end tag seen.
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test:  ❯ src/pages/dashboard/consumption/__tests__/CustomTooltip.component.spec.tsx:52:5
@ovh-ux/manager-web-office-app:test:      50|     const html = container.innerHTML;
@ovh-ux/manager-web-office-app:test:      51|
@ovh-ux/manager-web-office-app:test:      52|     await expect(html).toBeValidHtml();
@ovh-ux/manager-web-office-app:test:        |     ^
@ovh-ux/manager-web-office-app:test:      53|   });
@ovh-ux/manager-web-office-app:test:      54| });
   */
  it.skip('should have a valid html', async () => {
    const { container } = renderWithRouter(<CustomTooltip locale={fr} payload={testPayload} />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
