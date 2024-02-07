import RadioTile from '@/components/radio-tile';
import { ai } from '@/models/types';

const EditorTile = ({
  editor,
  selected,
  onChange,
}: {
  editor: ai.notebook.Editor;
  selected: boolean;
  onChange: (editor: ai.notebook.Editor) => void;
}) => {
  const handleEditorClick = () => {
    onChange(editor);
  };
  return (
    <RadioTile
      name="editor-select"
      onChange={handleEditorClick}
      value={editor.id}
      checked={selected}
    >
      <div className="flex justify-between items-center">
        <h3 className={`capitalize ${selected ? 'font-bold' : 'font-normal'}`}>
          {editor.name}
        </h3>
        <img
          className="block w-[40px] h-[40px]"
          src={editor.logoUrl}
        />
      </div>
      <RadioTile.Separator />
      <p className="text-sm ">{editor.description}</p>
    </RadioTile>
  );
};

export default EditorTile;
