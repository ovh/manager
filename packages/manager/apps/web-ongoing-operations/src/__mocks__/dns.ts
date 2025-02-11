interface DnsRecord {
  id: number;
  zone: string;
  status: 'cancelled' | 'todo' | 'doing' | 'problem' | 'error' | 'done';
  comment: string | null;
  doneDate: string | null;
  function: 'DnssecRollKsk' | 'DnssecRollZsk';
  todoDate: string;
  canCancel: boolean;
  lastUpdate: string;
  canRelaunch: boolean;
  creationDate: string;
  canAccelerate: boolean;
}
export const dns: DnsRecord[] = [
  {
    id: 1,
    zone: 'testpuwebdomain.us',
    status: 'cancelled',
    comment:
      'Retrying because domain_service.ds_records_state.reason_code=DsRecordStateReason.DNSSEC_ALREADY_PENDING',
    doneDate: null,
    function: 'DnssecRollKsk',
    todoDate: '2025-02-09T06:32:22.685182+01:00',
    canCancel: false,
    lastUpdate: '2025-02-07T06:32:22.727127+01:00',
    canRelaunch: false,
    creationDate: '2025-02-05T17:17:40.550434+01:00',
    canAccelerate: false,
  },
  {
    id: 2,
    zone: 'testdomain-puweb.fr',
    status: 'todo',
    comment: null,
    doneDate: null,
    function: 'DnssecRollZsk',
    todoDate: '2025-02-08T11:00:01.681979+01:00',
    canCancel: false,
    lastUpdate: '2025-02-07T11:00:01.721778+01:00',
    canRelaunch: false,
    creationDate: '2025-02-07T09:24:14.922580+01:00',
    canAccelerate: true,
  },
  {
    id: 3,
    zone: 'testdomain-puweb.fr',
    status: 'doing',
    comment: null,
    doneDate: null,
    function: 'DnssecRollZsk',
    todoDate: '2025-02-08T11:00:01.681979+01:00',
    canCancel: false,
    lastUpdate: '2025-02-07T11:00:01.721778+01:00',
    canRelaunch: false,
    creationDate: '2025-02-07T09:24:14.922580+01:00',
    canAccelerate: false,
  },
  {
    id: 4,
    zone: 'testdomain-puweb.fr',
    status: 'problem',
    comment: null,
    doneDate: null,
    function: 'DnssecRollZsk',
    todoDate: '2025-02-08T11:00:01.681979+01:00',
    canCancel: false,
    lastUpdate: '2025-02-07T11:00:01.721778+01:00',
    canRelaunch: false,
    creationDate: '2025-02-07T09:24:14.922580+01:00',
    canAccelerate: false,
  },
  {
    id: 5,
    zone: 'testdomain-puweb.fr',
    status: 'error',
    comment: null,
    doneDate: null,
    function: 'DnssecRollZsk',
    todoDate: '2025-02-08T11:00:01.681979+01:00',
    canCancel: false,
    lastUpdate: '2025-02-07T11:00:01.721778+01:00',
    canRelaunch: false,
    creationDate: '2025-02-07T09:24:14.922580+01:00',
    canAccelerate: false,
  },
  {
    id: 6,
    zone: 'testdomain-puweb.fr',
    status: 'done',
    comment: null,
    doneDate: null,
    function: 'DnssecRollZsk',
    todoDate: '2025-02-08T11:00:01.681979+01:00',
    canCancel: false,
    lastUpdate: '2025-02-07T11:00:01.721778+01:00',
    canRelaunch: false,
    creationDate: '2025-02-07T09:24:14.922580+01:00',
    canAccelerate: false,
  },
];
