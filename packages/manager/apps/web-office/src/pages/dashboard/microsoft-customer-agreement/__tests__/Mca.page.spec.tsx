import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import dashboardMcaTranslations from '@/public/translations/dashboard/microsoft-customer-agreement/Messages_fr_FR.json';
import { renderWithRouter } from '@/utils/Test.provider';

import { McaPage } from '../Mca.page';

describe('McaPage Component', () => {
  it('render test', () => {
    renderWithRouter(<McaPage />);

    expect(screen.getByText(dashboardMcaTranslations.signatory_informations)).toBeInTheDocument();
    expect(
      screen.getByText(dashboardMcaTranslations.signatory_informations_description),
    ).toBeInTheDocument();
  });
});

describe('McaPage W3C Validation', () => {
  // issue with ods on select:
  // expected HTML to be valid, but got:
  // Bad value “combobox” for attribute “role” on element “button”.
  // Bad value “” for attribute “aria-describedby” on element “button”: An IDREFS value must contain at least one non-whitespace character.
  // The “aria-controls” attribute must point to an element in the same document.
  // The “aria-labelledby” attribute must point to an element in the same document
  it.skip('should have a valid html', async () => {
    const { container } = renderWithRouter(<McaPage />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
