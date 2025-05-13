import { Tmessage } from '../api/logTailMessages';

export const logMessagesMock: Tmessage[] = [
  {
    _id: '0',
    level: 0,
    message: 'A level 0 (emergency) log message',
    source: 'a source',
    timestamp: '2024-12-03T19:26:21Z',
  },
  {
    _id: '1',
    level: 1,
    message: 'A level 1 (alert) log message',
    source: 'a source',
    timestamp: '2024-12-03T19:27:21Z',
  },
  {
    _id: '2',
    level: 2,
    message: 'A level 2 (critcal) log message',
    source: 'a source',
    timestamp: '2024-12-03T19:28:21Z',
  },
  {
    _id: '3',
    level: 3,
    message: 'A level 3 (error) log message',
    source: 'a source',
    timestamp: '2024-12-03T19:29:21Z',
  },
  {
    _id: '4',
    level: 4,
    message: 'A level 4 (warning) log message',
    source: 'a source',
    timestamp: '2024-12-03T19:30:21Z',
  },
  {
    _id: '5',
    level: 5,
    message: 'A level 5 (notice) log message',
    source: 'a source',
    timestamp: '2024-12-03T19:31:21Z',
  },
  {
    _id: '6',
    level: 6,
    message: 'A level 6 (info) log message',
    source: 'a source',
    timestamp: '2024-12-03T19:32:21Z',
  },
  {
    _id: '7',
    level: 7,
    message: 'A level 7 (debug) log message',
    source: 'a source',
    timestamp: '2024-12-03T19:33:21Z',
  },
];
