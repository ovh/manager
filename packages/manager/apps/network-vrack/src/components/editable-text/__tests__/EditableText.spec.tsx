import React from 'react';

import { act, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { EditableText } from '../EditableText';

describe('EditableText', () => {
  it('should display a text with an edit button', async () => {
    const updateCallBack = vi.fn();
    const component = render(<EditableText value="test_text" onUpdate={updateCallBack} />);

    expect(component.getByText('test_text')).toBeDefined();

    const editButton = component.getByRole('button');
    expect(editButton).toBeDefined();

    act(() => {
      editButton.click();
    });

    await waitFor(() => expect(component.getByRole('textbox')).toBeDefined());

    expect(component.getAllByRole('button').length).toEqual(2);

    act(() => {
      component.getAllByRole('button')[0]?.click();
    });
    expect(updateCallBack).toHaveBeenCalled();
  });
});
