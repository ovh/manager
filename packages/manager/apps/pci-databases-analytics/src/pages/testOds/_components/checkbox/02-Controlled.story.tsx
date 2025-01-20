/* eslint-disable import/no-extraneous-dependencies */
import { Checkbox } from '@datatr-ux/uxlib';
import { OdsCheckbox } from '@ovhcloud/ods-components/react';
import { useState } from 'react';
import { StoryResult } from '../Stories';

export default {
  story: 'Controlled',
  customComponentExemple: () => {
    const [chk, setIschk] = useState(false);
    return (
      <div>
        Checked: {chk ? 'true' : 'false'}
        <Checkbox
          className="text-white"
          checked={chk}
          onCheckedChange={(e) => setIschk(e as boolean)}
        />
      </div>
    );
  },
  customComponentResult: StoryResult.success,
  ODSComponentExemple: () => {
    const [chk, setIschk] = useState(false);
    return (
      <div>
        Checked: {chk ? 'true' : 'false'}
        <OdsCheckbox
          name="cb"
          className="text-white"
          isChecked={chk}
          onOdsChange={(e) => setIschk(e.target.isChecked)}
        />
      </div>
    );
  },
  ODSComponentResult: StoryResult.fail,
};
