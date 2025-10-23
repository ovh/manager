import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TimepickerTimezoneList } from '@/components';

describe('TimepickerTimezoneList', () => {
  it('renders the component with default props', () => {
    const { container } = render(<TimepickerTimezoneList />);
    expect(container).toBeTruthy();
  });
});
