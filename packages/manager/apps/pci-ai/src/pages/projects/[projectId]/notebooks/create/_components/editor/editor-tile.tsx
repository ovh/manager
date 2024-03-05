import RadioTile from '@/components/radio-tile';
import { H5, P } from '@/components/typography';
import { ai } from '@/models/types';

const EditorTile = ({
  editor,
  selected,
  onChange,
}: {
  editor: ai.notebook.Editor;
  selected: boolean;
  onChange: (editor: string) => void;
}) => {
  const handleEditorClick = () => {
    onChange(editor.id);
  };
  return (
    <RadioTile
    name="engine-select"
    onChange={handleEditorClick}
    value={editor.id}
    checked={selected}
  >
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <H5
          className={`capitalize ${selected ? 'font-bold' : 'font-normal'}`}
        >
          {editor.name}
        </H5>
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
    <P className="text-sm">
      {/** 
      {t(`description-${engine.name}`, engine.description)}
       */}
      {editor.description}
    </P>
  </RadioTile>
  );
};

export default EditorTile;
