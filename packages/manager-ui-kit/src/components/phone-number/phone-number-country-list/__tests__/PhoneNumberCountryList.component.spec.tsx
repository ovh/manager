import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PhoneNumberCountryList } from '@/components';

describe('PhoneNumberCountryList', () => {
  it('renders the component with default props', () => {
    const { container } = render(<PhoneNumberCountryList />);
    expect(container).toBeTruthy();
  });
});
