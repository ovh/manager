import { OdsRadio } from '@ovhcloud/ods-components/react';
import { useState } from 'react';
import { StoryResult } from '../Stories';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default {
  story: 'Tailwind',
  customComponentExemple: () => {
    const [v, setv] = useState('comfortable');
    return (
      <RadioGroup
        name="02"
        defaultValue="comfortable"
        value={v}
        onValueChange={(e) => setv(e)}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="default" id="r1" className="text-red-500" />
          <Label htmlFor="r1">Default</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="comfortable"
            id="r2"
            className="text-green-500"
          />
          <Label htmlFor="r2">Comfortable</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="compact" id="r3" className="text-purple-500" />
          <Label htmlFor="r3">Compact</Label>
        </div>
      </RadioGroup>
    );
  },
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <>
      <div className="flex items-center space-x-2">
        <OdsRadio
          input-id="huey"
          name="01ods"
          value="huey"
          className="text-red-500"
        ></OdsRadio>
        <label htmlFor="huey">Huey</label>
      </div>

      <div className="flex items-center space-x-2">
        <OdsRadio input-id="dewey" name="01ods" value="dewey"></OdsRadio>
        <label htmlFor="dewey">Dewey</label>
      </div>
      <div className="flex items-center space-x-2">
        <OdsRadio input-id="louie" name="01ods" value="louie"></OdsRadio>
        <label htmlFor="louie">Louie</label>
      </div>
    </>
  ),
  ODSComponentResult: StoryResult.fail,
};
