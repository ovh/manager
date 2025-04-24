import React from 'react';
import { describe, expect } from 'vitest';
import VerifyDomain from './Verify.page';
import { render, waitFor } from '@/utils/test.provider';

describe('VerifyDomain Page', () => {
  it('should render correctly', async () => {
    const { queryByTestId, container } = render(<VerifyDomain />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(container).toBeVisible();
  });
});
