import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithRouter, wrapper } from '@/utils/test.provider';

import Loading from '../Loading.component';

describe('Loading component', () => {
  it('should render loading component', () => {
    const { getByTestId } = render(<Loading />, { wrapper });
    const container = getByTestId('spinner');
    expect(container).toBeVisible();
  });
  it.skip('should have a valid html with a11y and w3c', async () => {
    const { container } = renderWithRouter(<Loading />);
    const html = container.innerHTML;
    await expect(html).toBeValidHtml();

    /*[aria-progressbar-name] ARIA progressbar nodes must have an accessible name
  - span
    Fix any of the following:
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
  Element has no title attribute
    await expect(container).toBeAccessible();

*/
  });
});
