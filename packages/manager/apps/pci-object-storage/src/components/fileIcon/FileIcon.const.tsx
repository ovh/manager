import {
  FileJson,
  FileCode,
  FileText,
  FileImage,
  FileArchive,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  FileLineChart,
  FileCog,
} from 'lucide-react';

export const FILE_TYPE_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  // Code / config
  js: FileCode,
  jsx: FileCode,
  ts: FileCode,
  tsx: FileCode,
  py: FileCode,
  sh: FileCode,
  bash: FileCode,
  json: FileJson,
  yml: FileCode,
  yaml: FileCode,
  xml: FileCode,
  html: FileCode,
  css: FileCode,
  scss: FileCode,
  vue: FileCode,

  // Text / markdown
  txt: FileText,
  md: FileText,
  log: FileText,

  // Images
  jpg: FileImage,
  jpeg: FileImage,
  png: FileImage,
  gif: FileImage,
  bmp: FileImage,
  svg: FileImage,
  webp: FileImage,
  heic: FileImage,

  // Videos
  mp4: FileVideo,
  mkv: FileVideo,
  mov: FileVideo,
  avi: FileVideo,
  webm: FileVideo,

  // Audio
  mp3: FileAudio,
  wav: FileAudio,
  flac: FileAudio,
  ogg: FileAudio,
  m4a: FileAudio,

  // Archives
  zip: FileArchive,
  tar: FileArchive,
  gz: FileArchive,
  rar: FileArchive,
  '7z': FileArchive,

  // Documents / spreadsheets / presentations
  pdf: FileText,
  csv: FileSpreadsheet,
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  ppt: FileLineChart,
  pptx: FileLineChart,
  doc: FileText,
  docx: FileText,

  // Config files
  env: FileCog,
  ini: FileCog,
  conf: FileCog,
};
