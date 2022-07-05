import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import VirtualAgent from '../../components/VirtualAgent';

describe('Virtual agent UI', () => {
  it('Closes on button click', async () => {
    const agent = render(<VirtualAgent></VirtualAgent>);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(agent.asFragment()).toMatchSnapshot();
    });
  });

  it('Is open by default', async () => {
    const agent = render(<VirtualAgent></VirtualAgent>);

    await waitFor(() => {
      expect(agent.asFragment()).toMatchSnapshot();
    });
  });
});
