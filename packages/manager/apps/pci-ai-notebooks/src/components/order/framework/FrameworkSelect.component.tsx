import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as ai from '@/types/cloud/project/ai';
import FrameworkTile from './FrameworkTile.component';
import { FrameworkWithVersion } from '@/types/orderFunnel';

interface FrameworkSelectProps {
  frameworks: ai.capabilities.notebook.Framework[];
  value: FrameworkWithVersion;
  onChange: (newFrameworkWithVersion: FrameworkWithVersion) => void;
}
const FrameworksSelect = React.forwardRef<
  HTMLInputElement,
  FrameworkSelectProps
>(({ frameworks, value, onChange }, ref) => {
  const [selectedFrameworkTypeIndex, setSelectedFrameworkTypeIndex] = useState(
    0,
  );
  const mappedFramework = frameworks.map((fmk) => ({
    ...fmk,
    type: fmk.docUrl ? 'classical' : 'quantique',
  }));
  const fmkTypes = [...new Set([...mappedFramework.map((mr) => mr.type)])];
  return (
    <>
      <div ref={ref}>
        <Tabs
          defaultValue="0"
          onValueChange={(v) => setSelectedFrameworkTypeIndex(+v)}
        >
          <TabsList className="bg-white justify-start p-0 hidden md:flex">
            {fmkTypes.map((fmkType, index) => (
              <TabsTrigger
                key={fmkType}
                value={`${index}`}
                className="-mb-[1px] px-4 text-lg text-primary-600 font-semibold h-full bg-white border border-primary-100 rounded-t-md rounded-b-none data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:bg-primary-50 data-[state=active]:border-b-primary-50 data-[state=active]:font-bold data-[state=active]:text-primary-800"
              >
                {fmkType}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 bg-primary-50 border border-primary-100 rounded-b-md">
            {mappedFramework
              .filter((r) => r.type === fmkTypes[selectedFrameworkTypeIndex])
              .map((fmk) => (
                <FrameworkTile
                  key={fmk.name}
                  framework={fmk}
                  version={
                    fmk.name === value.framework
                      ? fmk.versions.find((v: string) => v === value.version)
                      : fmk.versions[0]
                  }
                  selected={fmk.id === value.framework}
                  onChange={(
                    newFramework: ai.capabilities.notebook.Framework,
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
        </Tabs>
      </div>
    </>
  );
});

FrameworksSelect.displayName = 'FrameworksSelect';
export default FrameworksSelect;
