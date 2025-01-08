import { describe } from 'vitest';
import { getSanitizedSelectOptions } from './getSanitizedSelectOptions';
import { SelectOptionsProps } from '@/components/Form/SelectField.component';

describe('Sanitizing options test suite', () => {
  it('should return an array of object with value and label props', () => {
    const params: SelectOptionsProps<number> = {
      options: ['option1', 'option2', 'option3'],
    };

    expect(getSanitizedSelectOptions(params)).toEqual([
      { value: 'option1', label: 'option1' },
      { value: 'option2', label: 'option2' },
      { value: 'option3', label: 'option3' },
    ]);
  });
});
