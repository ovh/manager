export default class CountryFlagCtrl {
  getCountry() {
    const country = this.country && this.country.toLowerCase();
    switch (country) {
      case 'we':
        return 'us';
      case 'qc': // quebec
        return 'ca';
      case 'asia':
        return 'sg';
      case 'ac': // ascension island
        return 'gb';
      case 'ta': // tristan da cunha
        return 'gb';
      default:
        return country;
    }
  }
}
