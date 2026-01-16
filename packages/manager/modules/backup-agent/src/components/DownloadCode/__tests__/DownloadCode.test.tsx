import { ComponentProps } from 'react';

import { render, screen, waitFor } from '@testing-library/react';

import { DownloadCode } from '@/components/DownloadCode/DownloadCode.component';

const codeTestId = 'ods-code';

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsCode: (props: ComponentProps<'code'>) => <code data-testid={codeTestId} {...props}></code>,
}));

describe('DownloadCode', () => {
  it.each([
    { osCompatibility: 'LINUX', expectedNumberCommands: 2 } as const,
    { osCompatibility: 'WINDOWS', expectedNumberCommands: 1 } as const,
  ] as const)(
    'Show line for download for $osCompatibility',
    async ({ osCompatibility, expectedNumberCommands }) => {
      const { container } = render(
        <DownloadCode
          downloadLink="https://example.com/download"
          osCompatibility={osCompatibility}
        />,
      );

      await expect(container).toBeAccessible();

      await waitFor(() => {
        expect(screen.getAllByTestId(codeTestId).length).toBe(expectedNumberCommands);
      });

      screen
        .getAllByTestId(codeTestId)
        .forEach((el) => expect(el).toHaveTextContent('https://example.com/download'));
    },
  );
});
