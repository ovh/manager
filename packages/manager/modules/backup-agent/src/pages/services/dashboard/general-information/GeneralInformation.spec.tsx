import { waitFor } from '@testing-library/react';

import { renderTest } from '@/test-utils/Test.utils';

const TILES_TITLES = ['Informations générales', 'Abonnement', 'Mon offre'];

describe('[INTEGRATION] - General Information page', () => {
  it('Listing page display datagrid', async () => {
    const { container } = await renderTest({
      initialRoute: '/vaults/dashboard/a1b2c3d4-1234-4000-82dc-5366d6786f80',
    });

    /* eslint-disable max-nested-callbacks */
    await waitFor(
      () => {
        // forEach inside waitFor DOES NOT WORK
        // because errors inside forEach are swallowed, preventing waitFor from retrying
        // https://testing-library.com/docs/dom-testing-library/api-async/#waitfor
        for (const tileTitle of TILES_TITLES) {
          expect(
            Array.from(container.querySelectorAll('ods-text[preset="heading-4"]')).find(
              (title: Element) => title.textContent === tileTitle,
            ),
          ).toBeVisible();
        }
      },
      { timeout: 10_000 },
    );
  });
});
