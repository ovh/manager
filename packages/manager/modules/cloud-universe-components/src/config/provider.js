export default class CucConfigProvider {
  constructor() {
    this.region = 'EU';
  }

  setRegion(region = 'EU') {
    this.region = region;
  }

  $get() {
    return {
      getRegion: () => this.region,
    };
  }
}
