import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { format } from 'date-fns';
import { InputCalendar } from '../components';

const selectedDate = new Date(2022, 5, 18);

describe('Input Calendar', () => {
  // default locale is en-US
  it('renders input with current date in default locale format', () => {
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'P');

    render(<InputCalendar />);

    screen.getByDisplayValue(formattedDate);
  });

  it('renders input calendar with passed date and calendar closed', () => {
    const { asFragment } = render(<InputCalendar valueDate={selectedDate} />);

    // Snapshot should contain 06/18/2022 as input value
    // And calendar to have visibility hidden
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays calendar on input click', () => {
    const { asFragment } = render(<InputCalendar valueDate={selectedDate} />);

    const formattedDate = format(selectedDate, 'P');
    fireEvent.click(screen.getByDisplayValue(formattedDate));

    // Snapshot should contain calendar with visibility visible
    expect(asFragment()).toMatchSnapshot();
  });
});
