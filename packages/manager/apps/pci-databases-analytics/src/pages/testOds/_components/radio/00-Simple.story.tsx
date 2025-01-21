import { OdsRadio } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default {
  story: 'Simple radio',
  customComponentExemple: (
    <RadioGroup defaultValue="comfortable" name="00">
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
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <>
      <div className="flex items-center space-x-2">
        <OdsRadio input-id="huey" name="drone" value="huey"></OdsRadio>
        <label htmlFor="huey">Huey</label>
      </div>

      <div className="flex items-center space-x-2">
        <OdsRadio input-id="dewey" name="drone" value="dewey"></OdsRadio>
        <label htmlFor="dewey">Dewey</label>
      </div>
      <div className="flex items-center space-x-2">
        <OdsRadio input-id="louie" name="drone" value="louie"></OdsRadio>
        <label htmlFor="louie">Louie</label>
      </div>
    </>
  ),
  ODSComponentResult: StoryResult.success,
};
