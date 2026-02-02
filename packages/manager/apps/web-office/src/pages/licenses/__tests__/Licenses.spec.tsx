import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import actions from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';
import dashboard from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/dashboard/Messages_fr_FR.json';
import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import type { UseFeatureAvailabilityResult } from '@ovh-ux/manager-module-common-api';

import { renderWithRouter } from '@/utils/Test.provider';

import Licenses from '../Licenses.page';

describe('Licenses Page', () => {
  vi.mocked(useFeatureAvailability).mockReturnValue({
    data: {
      'web-office:order': true,
    },
    isLoading: false,
  } as unknown as UseFeatureAvailabilityResult<Record<string, boolean>>);
  it('should render page with content', async () => {
    const { getByTestId } = renderWithRouter(<Licenses />);

    await waitFor(() => {
      expect(getByTestId('licenses-order-button')).toBeInTheDocument();
    });

    const orderButton = getByTestId('licenses-order-button');
    expect(orderButton.className).contain('--primary');
    expect(orderButton).toHaveTextContent(actions.order);

    const sortedRows = getByTestId('header-serviceName');
    expect(sortedRows).toHaveTextContent(dashboard.service_name);
  });
});

describe('Licenses W3C Validation', () => {
  // issue with dropdown ods The “aria-controls” attribute must point to an element in the same document.
  it.skip('should have a valid html', async () => {
    const { container } = renderWithRouter(<Licenses />);
    const html = container.innerHTML;
    await expect(html).toBeValidHtml();
  });
});
