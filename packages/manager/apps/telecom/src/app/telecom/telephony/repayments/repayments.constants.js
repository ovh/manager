import moment from 'moment';

export const REPAYMENT_AMOUNT_THRESHOLD = 30;

export const COLUMNS = [
  {
    property: 'calledNumber',
    searchable: true,
    filterable: true,
    sortable: true,
  },
  {
    property: 'callingNumber',
    searchable: true,
    filterable: true,
    sortable: true,
  },
  {
    property: 'startDate',
    template: "{{ $row.startDate | date:'dd-MM-yyyy HH:mm:ss' }}",
    sortable: true,
  },
  {
    property: 'duration',
    sortable: true,
  },
  {
    property: 'buyAmount.value',
    sortable: true,
  },
  {
    property: 'status',
    filterable: true,
    sortable: true,
  },
];

export class RepaymentRow {
  constructor({
    calledNumber,
    callingNumber,
    startDate,
    duration,
    buyAmount,
    status,
  }) {
    Object.assign(this, {
      calledNumber,
      callingNumber,
      startDate,
      duration,
      buyAmount,
      status,
    });
  }

  formatStartDate() {
    return moment(this.startDate).format('DD-MM-YYYY HH:mm:ss');
  }

  formatDuration() {
    return moment.duration(this.duration).asSeconds();
  }
}

export default {
  RepaymentRow,
  COLUMNS,
  REPAYMENT_AMOUNT_THRESHOLD,
};
