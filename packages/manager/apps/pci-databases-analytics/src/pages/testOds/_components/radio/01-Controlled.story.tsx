import { OdsRadio } from '@ovhcloud/ods-components/react';
import { useState } from 'react';
import { StoryResult } from '../Stories';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default {
  story: 'Controlled',
  customComponentExemple: () => {
    const [v, setv] = useState('comfortable');
    return (
      <>
        <p>Value: {v}</p>
        <RadioGroup
          name="01"
          defaultValue="comfortable"
          value={v}
          onValueChange={(e) => setv(e)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="r1" />
            <Label htmlFor="r1">Default</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="comfortable" id="r2" />
            <Label htmlFor="r2">Comfortable</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="compact" id="r3" />
            <Label htmlFor="r3">Compact</Label>
          </div>
        </RadioGroup>
      </>
    );
  },
  customComponentResult: StoryResult.success,
  ODSComponentExemple: () => {
    const [v, setv] = useState('dewey');
    return (
      <>
        <p>Value: {v}</p>
        <div className="flex items-center space-x-2">
          <OdsRadio
            input-id="huey"
            name="01ods"
            value="huey"
            isChecked={v === 'huey'}
            onOdsChange={(e) => setv(e.target.value)}
          ></OdsRadio>
          <label htmlFor="huey">Huey</label>
        </div>

        <div className="flex items-center space-x-2">
          <OdsRadio
            input-id="dewey"
            name="01ods"
            value="dewey"
            isChecked={v === 'dewey'}
            onOdsChange={(e) => setv(e.target.value)}
          ></OdsRadio>
          <label htmlFor="dewey">Dewey</label>
        </div>
        <div className="flex items-center space-x-2">
          <OdsRadio
            input-id="louie"
            name="01ods"
            value="louie"
            isChecked={v === 'louie'}
            onOdsChange={(e) => setv(e.target.value)}
          ></OdsRadio>
          <label htmlFor="louie">Louie</label>
        </div>
      </>
    );
  },
  ODSComponentResult: StoryResult.warning,
};
