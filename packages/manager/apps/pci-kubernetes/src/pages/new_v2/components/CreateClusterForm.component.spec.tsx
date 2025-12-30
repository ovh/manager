import { RenderResult, render } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';

import { CreateClusterForm } from './CreateClusterForm.component';

const validClusterName = 'my_magical_cluster';
const invalidClusterName = '---';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useCatalogPrice: vi.fn().mockReturnValue({
    getTextPrice: vi.fn((price: number) => `${price}`),
    getFormattedHourlyCatalogPrice: vi.fn(),
    getFormattedMonthlyCatalogPrice: vi.fn(),
  }),
}));

describe('CreateClusterForm name management', () => {
  let user: UserEvent;
  let renderedDom: RenderResult;
  let nameField: Element;

  beforeEach(async () => {
    user = userEvent.setup();
    renderedDom = render(<CreateClusterForm />);

    const field = renderedDom.getByRole('textbox', { name: 'kubernetes_add_name_placeholder' });
    if (!field) throw new Error('Unable to find name field');

    await user.clear(field);
    nameField = field;
  });

  it('keeps synchronized name input and cart subtitle', async () => {
    await user.type(nameField, validClusterName);

    const cartHeaderSubtitle = renderedDom.getByTestId('cart-header-subtitle');
    expect(cartHeaderSubtitle).toHaveTextContent(validClusterName);
  });

  it('disables create button when name is invalid', async () => {
    await user.type(nameField, invalidClusterName);

    const createButton = renderedDom.getByText('kubernetes_add_create_cluster');
    expect(createButton).toBeDisabled();
  });
});
