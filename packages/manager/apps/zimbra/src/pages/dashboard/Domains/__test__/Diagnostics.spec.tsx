import React from 'react';
import { describe, expect, vi } from 'vitest';
// import { prettyDOM } from '@testing-library/dom';
import { useSearchParams } from 'react-router-dom';
import Diagnostics from '../Diagnostics.page';
import { render, waitFor } from '@/utils/test.provider';
import { domainDetailMock } from '@/api/_mock_';
// import diagnosticsTranslation from '@/public/translations/domains/diagnostic/Messages_fr_FR.json';

vi.mocked(useSearchParams).mockReturnValue([
  new URLSearchParams({
    domainId: domainDetailMock.id,
  }),
  vi.fn(),
]);

describe('Domain diagnostics page', () => {
  it('Page should display correctly', async () => {
    const { queryByTestId, container } = render(<Diagnostics />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    // console.log(prettyDOM(container));
  });
});
