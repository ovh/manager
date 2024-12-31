import React from 'react';
import { UserRound, UsersRound } from 'lucide-react';
import * as ai from '@/types/cloud/project/ai';
import { cn } from '@/lib/utils';
import RadioTile from '@/components/radio-tile/RadioTile.component';
import { EDITOR_CONFIG } from './editor.constants';

interface EditorsSelectProps {
  editors: ai.capabilities.notebook.Editor[];
  value: string;
  onChange: (newEditor: string) => void;
  className?: string;
}

const EditorsSelect = React.forwardRef<HTMLInputElement, EditorsSelectProps>(
  ({ editors, value, onChange, className }, ref) => {
    return (
      <div
        data-testid="editors-select-container"
        ref={ref}
        className={cn(
          'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2',
          className,
        )}
      >
        {editors.map((editor) => (
          <RadioTile
            data-testid={`editor-radio-tile-${editor.id}`}
            name="editor-select"
            key={editor.id}
            onChange={() => onChange(editor.id)}
            value={editor.id}
            checked={editor.id === value}
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <h5
                  className={`capitalize ${
                    editor.id === value ? 'font-bold' : 'font-normal'
                  }`}
                >
                  {editor.name}
                </h5>
                {editor.id === EDITOR_CONFIG.jupyterColab ? (
                  <UsersRound className="size-4" />
                ) : (
                  <UserRound className="size-4" />
                )}
              </div>
              {editor.logoUrl && (
                <img
                  className="block w-[40px] h-[40px]"
                  src={editor.logoUrl}
                  alt={editor.name}
                />
              )}
            </div>
            <RadioTile.Separator />
            <p className="text-xs text-justify leading-relaxed">
              {editor.description}
            </p>
          </RadioTile>
        ))}
      </div>
    );
  },
);
EditorsSelect.displayName = 'EditorsSelect';
export default EditorsSelect;
