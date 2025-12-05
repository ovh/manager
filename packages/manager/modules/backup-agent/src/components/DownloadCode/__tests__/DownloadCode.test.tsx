import { ComponentProps } from 'react';

import { render, screen } from '@testing-library/react';

import { DownloadCode } from '@/components/DownloadCode/DownloadCode.component';

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsCode: (props: ComponentProps<'code'>) => <code {...props}></code>,
}));

describe('DownloadCode', () => {
  it('Show line for download', async () => {
    const { container } = render(<DownloadCode downloadLink="https://example.com/download" />);

    await expect(container).toBeAccessible();

    expect(screen.getAllByRole('code').length).toBe(2);

    screen
      .getAllByRole('code')
      .forEach((el) => expect(el).toHaveTextContent('https://example.com/download'));
  });
});
