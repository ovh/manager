import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NoDataMessage from './NoDataMessage.component';

describe('NoDataMessageComponent', () => {
  it('matches snapshot', () => {
    const testMessage = 'Aucune donnée disponible';

    const { asFragment } = render(<NoDataMessage message={testMessage} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
