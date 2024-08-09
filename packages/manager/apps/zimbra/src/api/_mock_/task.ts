export const taskDetailMock = {
  createdAt: 'string',
  errors: [{ message: 'string' }],
  finishedAt: 'string',
  id: '1',
  link: 'string',
  message: 'string',
  progress: [{ name: 'string', status: 'string' }],
  startedAt: 'string',
  status: 'string',
  type: 'string',
  updatedAt: 'string',
};

export const taskMocks = [
  taskDetailMock,
  { ...taskDetailMock, id: '2' },
  { ...taskDetailMock, id: '3' },
  { ...taskDetailMock, id: '4' },
  { ...taskDetailMock, id: '5' },
];
