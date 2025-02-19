import { useState } from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { StoryResult } from '../Stories';
import { RadioGroup } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default {
  story: 'Tile',
  customComponentExemple: () => {
    const [v, setv] = useState('comfortable');
    const values = ['default', 'comfortable', 'compact'];
    return (
      <RadioGroup
        name="03"
        defaultValue="comfortable"
        value={v}
        onValueChange={(e) => setv(e)}
      >
        {values.map((val) => (
          <RadioGroupPrimitive.Item value={val} id={val} key={val}>
            <Card
              className={cn(
                'cursor-pointer border transition-all',
                v === val
                  ? 'border-blue-500 ring ring-blue-200'
                  : 'hover:border-gray-300',
              )}
            >
              <CardContent className="text-center p-6 py-4">{val}</CardContent>
            </Card>
          </RadioGroupPrimitive.Item>
        ))}
      </RadioGroup>
    );
  },
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <span className="text-red-500">Not possible</span>,
  ODSComponentResult: StoryResult.fail,
};
