/* eslint-disable import/no-extraneous-dependencies */
import { OdsSelect } from '@ovhcloud/ods-components/react';
import { Cat, Dog, Fish, Rabbit, Turtle } from 'lucide-react';
import { useState } from 'react';
import { StoryResult } from '../Stories';
import { MultiSelect } from './multi-select';

const frameworksList = [
  { value: 'react', label: 'React', icon: Turtle },
  { value: 'angular', label: 'Angular', icon: Cat },
  { value: 'vue', label: 'Vue', icon: Dog },
  { value: 'svelte', label: 'Svelte', icon: Rabbit },
  { value: 'ember', label: 'Ember', icon: Fish },
];

export default {
  story: 'Multiple',
  customComponentExemple: () => {
    const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([
      'react',
      'angular',
    ]);

    return (
      <div>
        <MultiSelect
          className='w-[500px]'
          options={frameworksList}
          onValueChange={setSelectedFrameworks}
          defaultValue={selectedFrameworks}
          placeholder="Select frameworks"
          variant="default"
          animation={2}
          maxCount={3}
        />
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Selected Frameworks:</h2>
          <ul className="list-disc list-inside">
            {selectedFrameworks.map((framework) => (
              <li key={framework}>{framework}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  },
  customComponentResult: StoryResult.success,
  ODSComponentExemple: () => {
    const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([
      'react',
      'angular',
    ]);
    return (
      <>
        <OdsSelect
          value={selectedFrameworks}
          onOdsChange={(v) => setSelectedFrameworks(v.target.value as string[])}
          allowMultiple={true}
          placeholder="Select a fruit"
          name="s"
          className="bg-blue-100 text-green-500"
        >
          {frameworksList.map((f) => (
            <option key={f.value} value={f.value}>
              <f.icon /> {f.label}
            </option>
          ))}
        </OdsSelect>
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Selected Frameworks:</h2>
          <ul className="list-disc list-inside">
            {selectedFrameworks.map((framework) => (
              <li key={framework}>{framework}</li>
            ))}
          </ul>
        </div>
      </>
    );
  },
  ODSComponentResult: StoryResult.warning,
};
