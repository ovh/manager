import { waitFor, screen } from '@testing-library/react';
import { render } from '../../../utils/test.provider';
import { Description, DescriptionProps } from './description.component';

const setupSpecTest = async (customProps?: Partial<DescriptionProps>) =>
  waitFor(() => render(<Description {...customProps} />));

describe('description component', () => {
  it('renders description correctly', async () => {
    const customProps = {
      children: 'Custom description text',
    };
    await setupSpecTest(customProps);

    const descriptionText = screen.getByText(customProps.children);
    expect(descriptionText).toBeInTheDocument();
  });
});
