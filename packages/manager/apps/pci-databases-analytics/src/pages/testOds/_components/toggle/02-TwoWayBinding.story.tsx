/* eslint-disable import/no-extraneous-dependencies */
import { OdsToggle } from '@ovhcloud/ods-components/react';
import { useState } from 'react';
import { StoryResult } from '../Stories';
import { Switch } from '@/components/ui/switch';

export default {
  story: 'Controlled',
  customComponentExemple: () => {
    const [v, setV] = useState(false);
    return (
      <div>
        <p>Value: {v ? 'true' : 'false'}</p>
        <Switch checked={v} onCheckedChange={setV} />
      </div>
    );
  },
  customComponentResult: StoryResult.success,
  ODSComponentExemple: () => {
    const [v, setV] = useState(false);
    return (
      <div>
      <p>Value: {v ? 'true' : 'false'}</p>
        <OdsToggle
          value={v}
          name="toggle3"
          onOdsChange={(e) => setV(e.target.value)}
        />
      </div>
    );
  },
  ODSComponentResult: StoryResult.fail,
};
