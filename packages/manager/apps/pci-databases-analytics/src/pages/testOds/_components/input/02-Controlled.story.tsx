import { useState } from 'react';
import { OdsInput } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import { Input } from '@/components/ui/input';

export default {
  story: 'Controlled ipnut',
  customComponentExemple: () => {
    const [v, setV] = useState('Hello world');
    return (
      <>
        <p>value: {v} </p>
        <Input
          placeholder="Enter something here"
          value={v}
          onChange={(e) => setV(e.target.value)}
        />
      </>
    );
  },
  customComponentResult: StoryResult.success,
  ODSComponentExemple: () => {
    const [v, setV] = useState('Hello world');
    return (
      <>
        <p>value: {v} </p>
        <OdsInput
          name="d"
          placeholder="Enter something here"
          value={v}
          onOdsChange={(e) => setV(e.target.value as string)}
        />
      </>
    );
  },
  ODSComponentResult: StoryResult.warning,
};
