import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es';

import { Calendar, capitalizeFirstLetter } from '../components';

const selectedDate = new Date(2022, 5, 18);

describe('Calendar', () => {
  it('default renders correctly to current date with default locale', () => {
    render(<Calendar />);
    const currentDate = new Date();
    screen.getByText(capitalizeFirstLetter(format(currentDate, 'MMMM')));
  });

  it('renders correctly with passed date', () => {
    const { asFragment } = render(<Calendar valueDate={selectedDate} />);

    // Expect weeks to be rendered, passed date to be aria-pressed=true and to render other dates of month
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with different locale', () => {
    const { asFragment } = render(
      <Calendar valueDate={selectedDate} locale={esLocale} />,
    );
    // Expect calendar snapshot to be in spanish
    expect(asFragment()).toMatchSnapshot();
  });

  it('highlights correct date on date select', () => {
    const { asFragment } = render(<Calendar valueDate={selectedDate} />);

    fireEvent.click(screen.getByText('19'));

    // Expect aria-pressed=true on date 19 on snapshot
    expect(asFragment()).toMatchSnapshot();
  });

  it('changes to next month on right arrow button click', () => {
    const { asFragment } = render(<Calendar valueDate={selectedDate} />);

    fireEvent.click(screen.getByLabelText('next month'));

    // Expect snapshot to be on july
    expect(asFragment()).toMatchSnapshot();
  });

  it('moves to next year on next arrow click on December', () => {
    const { asFragment } = render(
      <Calendar valueDate={new Date(2022, 11, 17)} />,
    );

    fireEvent.click(screen.getByLabelText('next month'));

    // Check snapshot to be on January 2023
    expect(asFragment()).toMatchSnapshot();
  });

  it('moves to previous year on previous arrow click on January', () => {
    const { asFragment } = render(
      <Calendar valueDate={new Date(2022, 0, 17)} />,
    );

    fireEvent.click(screen.getByLabelText('previous month'));

    // Check snapshot to be on December 2021
    expect(asFragment()).toMatchSnapshot();
  });

  it('changes to previous month on left arrow button click', () => {
    const { asFragment } = render(<Calendar valueDate={selectedDate} />);

    fireEvent.click(screen.getByLabelText('previous month'));

    // Expect snapshot to be on May
    expect(asFragment()).toMatchSnapshot();
  });

  it('changes to month view on month click', () => {
    const { asFragment } = render(<Calendar valueDate={selectedDate} />);
    const monthTrigger = screen.getByText(
      capitalizeFirstLetter(format(selectedDate, 'MMMM')),
    );
    fireEvent.click(monthTrigger);

    // Expect dom to be all the months rendered as buttons and selected month to be aria-pressed=true
    expect(asFragment()).toMatchSnapshot();
  });

  it('changes month on click on month button in view "month"', () => {
    const { asFragment } = render(<Calendar valueDate={selectedDate} />);
    const monthTrigger = screen.getByText(
      capitalizeFirstLetter(format(selectedDate, 'MMMM')),
    );
    fireEvent.click(monthTrigger);

    const januaryTrigger = screen.getByText(
      capitalizeFirstLetter(
        format(
          new Date(selectedDate.getFullYear(), 0, selectedDate.getDate()),
          'MMMM',
        ),
      ),
    );
    fireEvent.click(januaryTrigger);

    // Expect header to change to "January" and to return to normal view
    expect(asFragment()).toMatchSnapshot();
  });

  it('changes to view year on year click', () => {
    const { asFragment } = render(<Calendar valueDate={selectedDate} />);

    fireEvent.click(screen.getByText(selectedDate.getFullYear()));

    // Expect snapshot to have a list of years instead of dates
    expect(asFragment()).toMatchSnapshot();
  });

  it('on view year, it selects a year on year click and returns to default view', () => {
    const { asFragment } = render(<Calendar valueDate={selectedDate} />);

    fireEvent.click(screen.getByText(selectedDate.getFullYear()));

    fireEvent.click(screen.getByText('2026'));

    // Expect snapshot to have year '2026' and to have returned to default view
    expect(asFragment()).toMatchSnapshot();
  });

  it('increments range of years on next button click on year view', () => {
    const { asFragment } = render(<Calendar valueDate={selectedDate} />);

    fireEvent.click(screen.getByText(selectedDate.getFullYear()));

    fireEvent.click(screen.getByLabelText('next month'));

    // Expect snapshot to have a new range of years
    expect(asFragment()).toMatchSnapshot();
  });

  it('decrements range of years on previous button click on year view', () => {
    const { asFragment } = render(<Calendar valueDate={selectedDate} />);

    fireEvent.click(screen.getByText(selectedDate.getFullYear()));

    fireEvent.click(screen.getByLabelText('previous month'));

    // Expect snapshot to have a new range of years
    expect(asFragment()).toMatchSnapshot();
  });
});
