import { ai } from '@/models/types';
import React from 'react';
import EditorTile from './editor-tile';

interface EditorSelectProps {
  editors: ai.notebook.Editor[];
  value: string;
  onChange: (newEditor: string) => void;
}

const EditorSelect = React.forwardRef<HTMLInputElement, EditorSelectProps>(
  ({ editors, value, onChange }, ref) => {
    return (
      <div
        ref={ref}
        className="mb-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2"
      >
        {editors.map((editor) => (
          <EditorTile
            key={editor.name}
            editor={editor}
            selected={editor.id === value}
            onChange={(newEditor: string) => {
              onChange((newEditor = newEditor));
            }}
          />
        ))}
      </div>
    );
  },
);

export default EditorSelect;
