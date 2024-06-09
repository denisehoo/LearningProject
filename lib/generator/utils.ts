export function encode(prompt: string): string {
  const replacementDict: { [key: string]: string } = {
      ' ': '%20',
      ',': '%2C',
  };

  const translationTable = prompt.split('').map(char => replacementDict[char] || char).join('');

  const outputString = "%27" + translationTable;

  return outputString;
}

export function decode(encoded: string): string {
  const replacementDict: { [key: string]: string } = {
      '%20': ' ',
      '%2C': ',',
      '%27': ''
  };

  let decoded = encoded;

  for (const [encodedChar, decodedChar] of Object.entries(replacementDict)) {
    decoded = decoded.split(encodedChar).join(decodedChar);
  }

  // Remove the starting comma if it exists
  if (decoded.startsWith('\',')) {
    decoded = decoded.slice(2).trim();
  }

  if (decoded.startsWith('\'')) {
    decoded = decoded.slice(1).trim();
  }

  return decoded;
}

export function replaceRandomWords(input: string): string {
  const regex = /\{(.*?)\}/g;

  return input.replace(regex, (match, group) => {
    const words = group.split('|');
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    return randomWord;
  })
}
  