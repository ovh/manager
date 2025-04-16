import { within } from '@testing-library/react';

export const assertTextWithinElement = ({
  text,
  element,
}: {
  text: string;
  element: HTMLElement;
}) => expect(within(element).getByText(text)).toBeVisible();
