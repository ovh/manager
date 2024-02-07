import { ai } from '@/models/types';
import EditorTile from './editor-tile';

interface EditorSelectProps {
  selectedEdt: ai.notebook.Editor;
  listEditors: ai.notebook.Editor[];
  onChange: ({
    editor,
  }: {
    editor: ai.notebook.Editor;
  }) => void;
}

const EditorSelect = ({
  selectedEdt,
  listEditors,
  onChange,
}: EditorSelectProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
        {listEditors.map((edt) => (
          <EditorTile
            key={edt.name}
            editor={edt}
            selected={edt === selectedEdt}
            onChange={(e) => {
              onChange({ editor: e});
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EditorSelect;