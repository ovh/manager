import React from 'react';
import { UserRound, UsersRound } from 'lucide-react';
import { RadioGroup, RadioTile, Separator } from '@datatr-ux/uxlib';
import { EDITOR_CONFIG } from './editor.constants';
import ai from '@/types/AI';

interface EditorsSelectProps {
  editors: ai.capabilities.notebook.Editor[];
  value: string;
  onChange: (newEditor: string) => void;
}

const EditorsSelect = React.forwardRef<HTMLInputElement, EditorsSelectProps>(
  ({ editors, value, onChange }, ref) => {
    return (
      <RadioGroup
        data-testid="editors-select-container"
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 rounded-b-md "
        value={value}
        onValueChange={onChange}
      >
        {editors.map((editor) => (
          <RadioTile
            data-testid={`editor-radio-tile-${editor.id}`}
            key={editor.id}
            onChange={() => onChange(editor.id)}
            value={editor.id}
            checked={editor.id === value}
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <h5 className="capitalize">{editor.name}</h5>
                {editor.id === EDITOR_CONFIG.jupyterColab ? (
                  <UsersRound className="size-4" />
                ) : (
                  <UserRound className="size-4" />
                )}
              </div>
              {editor.logoUrl && (
                <img
                  className="block w-[25px] h-[25px]"
                  src={editor.logoUrl}
                  alt={editor.name}
                />
              )}
            </div>
            <Separator className="my-2" />
            <p className="text-sm leading-relaxed">{editor.description}</p>
          </RadioTile>
        ))}
      </RadioGroup>
    );
  },
);
EditorsSelect.displayName = 'EditorsSelect';
export default EditorsSelect;
