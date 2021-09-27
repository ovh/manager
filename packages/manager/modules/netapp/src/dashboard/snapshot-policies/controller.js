export default class OvhManagerNetAppSnapshotPoliciesCtrl {
  // TODO: remove this stubs
  $onInit() {
    this.options = [
      {
        id: 1,
        label: 'First',
      },
      {
        id: 2,
        label: 'Second',
      },
      {
        id: 1,
        label: 'Third',
      },
    ];

    this.optionList = [];
  }

  onSelected(items) {
    this.optionList = items;
  }
}
