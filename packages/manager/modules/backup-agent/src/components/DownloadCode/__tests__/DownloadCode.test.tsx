import { ComponentProps } from 'react';

import { render, screen, waitFor } from '@testing-library/react';

import { DownloadCode } from '@/components/DownloadCode/DownloadCode.component';

const codeTestId = 'ods-code';

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsCode: (props: ComponentProps<'code'>) => <code data-testid={codeTestId} {...props}></code>,
}));

describe('DownloadCode', () => {
  it('Show line for download', async () => {
    const { container } = render(<DownloadCode downloadLink="https://example.com/download" />);

    await expect(container).toBeAccessible();

    await waitFor(() => {
      expect(screen.getAllByTestId(codeTestId).length).toBe(2);
    });

    screen
      .getAllByTestId(codeTestId)
      .forEach((el) => expect(el).toHaveTextContent('https://example.com/download'));
  });
});
