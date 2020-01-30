import upperFirst from 'lodash/upperFirst';
import words from 'lodash/words';

export default () =>
  function wordsFilter(text, capitalizeFirstWord) {
    const wordsList = words(text);

    if (capitalizeFirstWord) {
      for (let i = 0; i < wordsList.length; i += 1) {
        if (i === 0) {
          wordsList[i] = upperFirst(wordsList[i]);
        } else {
          wordsList[i] = wordsList[i].toLowerCase();
        }
      }
    }

    return wordsList.join(' ');
  };
