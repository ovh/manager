import { act, fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import actions from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';
import form from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/form/Messages_fr_FR.json';

import { CountriesEnum, LanguagesEnum } from '@/data/api/mca/type';
import dashboardMcaTranslations from '@/public/translations/dashboard/microsoft-customer-agreement/Messages_fr_FR.json';
import { renderWithRouter } from '@/utils/Test.provider';

import McaStep1 from '../McaStep1.component';

const defaultProps = {
  country: CountriesEnum.FR,
  email: 'test@example.com',
  firstname: 'John',
  language: LanguagesEnum.fr_FR,
  name: 'Doe',
  organisation: 'Test Company',
  phone: '+33123456789',
  isSubmitting: false,
  handleSaveClick: vi.fn(),
};

describe('McaStep1 Component', () => {
  it('render test', () => {
    renderWithRouter(<McaStep1 {...defaultProps} />);

    expect(screen.getByText(dashboardMcaTranslations.signatory_informations)).toBeInTheDocument();
    expect(
      screen.getByText(dashboardMcaTranslations.signatory_informations_description),
    ).toBeInTheDocument();
  });

  it('renders all form fields correctly', () => {
    renderWithRouter(<McaStep1 {...defaultProps} />);

    expect(screen.getByText(`${form.country} - ${form.required}`)).toBeInTheDocument();
    expect(screen.getByText(`${form.companyName} - ${form.required}`)).toBeInTheDocument();
    expect(screen.getByText(`${form.language} - ${form.required}`)).toBeInTheDocument();
    expect(screen.getByText(`${form.firstname} - ${form.required}`)).toBeInTheDocument();
    expect(screen.getByText(`${form.lastname} - ${form.required}`)).toBeInTheDocument();
    expect(screen.getByText(`${form.email} - ${form.required}`)).toBeInTheDocument();
    expect(screen.getByText(`${form.phone} - ${form.required}`)).toBeInTheDocument();
  });

  // issue for test new select / combobox ods field the button confirm still disabled
  it.skip('handles form submission correctly', async () => {
    renderWithRouter(<McaStep1 {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: actions.confirm });

    await act(() => fireEvent.click(submitButton));

    expect(defaultProps.handleSaveClick).toHaveBeenCalled();
  });
});

describe('McaStep1 W3C Validation', () => {
  // issue with ods on select:
  // expected HTML to be valid, but got:
  // Bad value “combobox” for attribute “role” on element “button”.
  // Bad value “” for attribute “aria-describedby” on element “button”: An IDREFS value must contain at least one non-whitespace character.
  // The “aria-controls” attribute must point to an element in the same document.
  // The “aria-labelledby” attribute must point to an element in the same document
  it.skip('should have a valid html', async () => {
    const { container } = renderWithRouter(<McaStep1 {...defaultProps} />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
