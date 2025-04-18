export const taskMock = {
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
  taskMock,
  { ...taskMock, id: '2' },
  { ...taskMock, id: '3' },
  { ...taskMock, id: '4' },
  { ...taskMock, id: '5' },
];
