import { describe, expect } from 'vitest';

import actions from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import { licensesPrepaidExpandedMock } from '@/data/api/__mocks__/license';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { renderWithRouter } from '@/utils/Test.provider';

import ActionButtonLicenses from '../ActionButtonLicenses.component';

describe('Licenses datagrid action menu', () => {
  it('we have good number of item with good content for mcaAgreed true', () => {
    const { getAllByTestId } = renderWithRouter(
      <ActionButtonLicenses
        serviceName={licensesPrepaidExpandedMock[0].serviceName}
        serviceDetailUrl={''}
        mcaUrl={''}
        mcaAgreed={true}
      />,
    );

    const menuItems = getAllByTestId('manager-button');

    expect(menuItems.length).toBe(1);

    expect(menuItems[0]).toHaveTextContent(actions.go_to_details);
  });

  it('we have good number of item with good content for mcaAgreed false', () => {
    const { getAllByTestId } = renderWithRouter(
      <ActionButtonLicenses
        serviceName={licensesPrepaidExpandedMock[0].serviceName}
        serviceDetailUrl={''}
        mcaUrl={''}
        mcaAgreed={false}
      />,
    );

    const menuItems = getAllByTestId('manager-button');

    expect(menuItems.length).toBe(2);

    expect(menuItems[0]).toHaveTextContent(commonTranslation.contract_signature);
    expect(menuItems[1]).toHaveTextContent(actions.go_to_details);
  });
});

describe('Users datagrid (licence) action menu W3C Validation', () => {
  /*
    issue with ods popover
    error: The “aria-controls” attribute must point to an element in the same document.
   */
  it.skip('should have a valid html', async () => {
    const { container } = renderWithRouter(
      <ActionButtonLicenses
        serviceName={licensesPrepaidExpandedMock[0].serviceName}
        serviceDetailUrl={''}
        mcaUrl={''}
        mcaAgreed={false}
      />,
    );
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
