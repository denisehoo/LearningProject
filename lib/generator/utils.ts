export function encode(prompt: string): string {
  const replacementDict: { [key: string]: string } = {
      ' ': '%20',
      ',': '%2C',
  };

  const translationTable = prompt.split('').map(char => replacementDict[char] || char).join('');

  const outputString = '%27' + translationTable;

  return outputString;
}

export function replaceRandomWords(input: string): string {
  const regex = /\{(.*?)\}/g;
  return input.replace(regex, (match, group) => {
    const words = group.split('|');
    const randomWord = words[Math.floor(Math.random() * words.length)];
    return randomWord;
  })
}
  