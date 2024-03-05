import { frameworkWithVersion } from '@/models/order-funnel';
import { ai } from '@/models/types';
import React from 'react';
import FrameworkTile from './framework-tile';

interface FrameworkSelectProps {
  frameworks: ai.notebook.Framework[];
  value: frameworkWithVersion;
  onChange: (newFrameworkWithVersion: frameworkWithVersion) => void;
}

const FrameworkSelect = React.forwardRef<
  HTMLInputElement,
  FrameworkSelectProps
>(({ frameworks, value, onChange }, ref) => {
  return (
    <div
      ref={ref}
      className="mb-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2"
    >
      {frameworks.map((framework) => (
        <FrameworkTile
          key={framework.id}
          framework={framework}
          version={
            framework.id === value.framework
              ? framework.versions.find((v) => v === value.version) ??
                framework.versions[0]
              : framework.versions[0]
          }
          selected={framework.id === value.framework}
          onChange={(
            newFramework: ai.notebook.Framework,
            newVersion: string,
          ) => {
            onChange({
              framework: newFramework.id,
              version: newVersion,
            });
          }}
        />
      ))}
    </div>
  );
});

export default FrameworkSelect;
