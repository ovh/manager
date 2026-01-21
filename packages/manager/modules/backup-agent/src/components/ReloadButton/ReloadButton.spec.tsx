import { QueryKey } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import { ReloadButton, dataTestId } from './ReloadButton.component';

const invalidateQueriesSpy = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useQueryClient() {
    return {
      invalidateQueries: (props: string[][]) => invalidateQueriesSpy(props),
    };
  },
}));

describe('ReloadButton', () => {
  it('should call queryClient.invalidateQueries', () => {
    const queryKey = ['test'] as unknown as QueryKey[];
    render(<ReloadButton isLoading={false} queryKeys={[queryKey]} />);

    expect(invalidateQueriesSpy).not.toHaveBeenCalled();

    const button = screen.getByTestId(dataTestId);
    button.click();

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey });
  });
});
