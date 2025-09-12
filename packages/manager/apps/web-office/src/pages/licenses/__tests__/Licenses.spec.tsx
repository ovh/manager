import actions from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import { render, waitFor } from '@/utils/Test.provider';

import Licenses from '../Licenses.page';

describe('Licenses Page', () => {
  it('should render page with content', async () => {
    const { getByTestId } = render(<Licenses />);

    await waitFor(() => {
      expect(getByTestId('licenses-order-button')).toBeInTheDocument();
    });

    const orderButton = getByTestId('licenses-order-button');
    const sortedRows = getByTestId('header-serviceName');

    expect(orderButton).toBeInTheDocument();
    expect(orderButton).toHaveAttribute('label', actions.order);

    expect(orderButton).toHaveAttribute('color', 'primary');
    expect(orderButton).toHaveAttribute('variant', 'outline');

    expect(sortedRows).toHaveTextContent('service_name');
  });
});
