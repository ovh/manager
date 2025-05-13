import { selectableTileClass, selectedTileClass } from '../../constants/style';

export const regionContainer =
  'grid gap-6 list-none p-6 m-0 grid-cols-1 md:grid-cols-3';

export const regionTile = selectableTileClass;

export const regionTileSelected = `font-bold ${selectedTileClass}`;
