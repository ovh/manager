export default class {
  dataChange(region) {
    this.onDataChange({
      data: { selectedRegion: region },
    });
  }
}
