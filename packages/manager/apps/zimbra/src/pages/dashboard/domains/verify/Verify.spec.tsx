import React from 'react';

import { waitFor } from '@testing-library/dom';
import { describe, expect } from 'vitest';

import { render } from '@/utils/test.provider';

import VerifyDomain from './Verify.page';

describe('VerifyDomain Page', () => {
  it('should render correctly', async () => {
    const { queryByTestId, container } = render(<VerifyDomain />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(container).toBeVisible();
  });
});
