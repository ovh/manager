import { OdsSelect } from '@ovhcloud/ods-components/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StoryResult } from '../Stories';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
  { value: 'honeydew', label: 'Honeydew' },
  { value: 'kiwi', label: 'Kiwi' },
  { value: 'lemon', label: 'Lemon' },
  { value: 'mango', label: 'Mango' },
  { value: 'nectarine', label: 'Nectarine' },
  { value: 'orange', label: 'Orange' },
  { value: 'papaya', label: 'Papaya' },
  { value: 'quince', label: 'Quince' },
  { value: 'raspberry', label: 'Raspberry' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'tangerine', label: 'Tangerine' },
  { value: 'watermelon', label: 'Watermelon' },
  { value: 'zucchini', label: 'Zucchini' },
];

export default {
  story: 'Tailwind',
  customComponentExemple: (
    <Select>
      <SelectTrigger className="w-[180px] bg-blue-100 text-green-500">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent className="bg-blue-100">
      {options.map((o) => (
          <SelectItem value={o.value} key={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsSelect
      placeholder="Select a fruit"
      name="s"
      className="bg-blue-100 text-green-500"
    >
      {options.map((o) => (
        <option value={o.value} key={o.value}>
          {o.label}
        </option>
      ))}
    </OdsSelect>
  ),
  ODSComponentResult: StoryResult.fail,
};
