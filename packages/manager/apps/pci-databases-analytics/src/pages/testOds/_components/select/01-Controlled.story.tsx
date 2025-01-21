import { OdsSelect } from '@ovhcloud/ods-components/react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StoryResult } from '../Stories';

export default {
  story: 'Controlled',
  customComponentExemple: () => {
    const [v, setV] = useState('grapes');
    return (
      <>
        <p>Value: {v}</p>
        <Select value={v} onValueChange={(a) => setV(a)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectContent>
        </Select>
      </>
    );
  },
  customComponentResult: StoryResult.success,
  ODSComponentExemple: () => {
    const [v, setV] = useState(['grapes']);
    return (
      <>
        <p>Value: {v}</p>
        <OdsSelect
          placeholder="Select a fruit"
          name="s"
          value={v}
          onOdsChange={(a) => setV(a.target.value as string[])}
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="blueberry">Blueberry</option>
          <option value="grapes">Grapes</option>
          <option value="pineapple">Pineapple</option>
        </OdsSelect>
      </>
    );
  },
  ODSComponentResult: StoryResult.warning,
};
