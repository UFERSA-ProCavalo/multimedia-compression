// Compressão e descompressão RLE para Uint8Array e string

/**
 * Comprime um Uint8Array ou string usando Codificação de Comprimento de Execução (RLE).
 *
 * RLE substitui sequências de bytes repetidos por uma contagem e o valor, por exemplo:
 *   [97,97,97,98,98,98] -> [3,97,3,98]
 *
 * @param {Uint8Array | string} input - Os dados a serem comprimidos (string ou bytes)
 * @returns {Uint8Array} Os dados comprimidos como [contagem, valor, ...]
 *
 * Exemplo:
 *   rleCompress("aaabbb") // Uint8Array([3,97,3,98])
 */
export function rleCompress(input: Uint8Array | string): Uint8Array {
  const data = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  const result: number[] = [];
  let i = 0;
  while (i < data.length) {
    let count = 1;
    while (i + count < data.length && data[i] === data[i + count] && count < 255) {
      count++;
    }
    result.push(count, data[i]);
    i += count;
  }
  return new Uint8Array(result);
}

/**
 * Descomprime um Uint8Array usando Codificação de Comprimento de Execução (RLE).
 *
 * Lê pares de [contagem, valor] e expande para os dados originais.
 *
 * @param {Uint8Array} input - Os dados comprimidos
 * @returns {Uint8Array} Os dados descomprimidos/originais
 *
 * Exemplo:
 *   rleDecompress(Uint8Array([3,97,3,98])) // Uint8Array([97,97,97,98,98,98])
 */
export function rleDecompress(input: Uint8Array): Uint8Array {
  const result: number[] = [];
  for (let i = 0; i < input.length; i += 2) {
    const count = input[i];
    const value = input[i + 1];
    for (let j = 0; j < count; j++) {
      result.push(value);
    }
  }
  return new Uint8Array(result);
}

/**
 * Auxiliar: Converte Uint8Array para string (UTF-8)
 *
 * @param {Uint8Array} data - Os bytes a serem decodificados
 * @returns {string} A string decodificada
 *
 * Exemplo:
 *   uint8ToString(Uint8Array([97,98,99])) // "abc"
 */
export function uint8ToString(data: Uint8Array): string {
  return new TextDecoder().decode(data);
}

/**
 * Auxiliar: Converte string para Uint8Array (UTF-8)
 *
 * @param {string} data - A string a ser codificada
 * @returns {Uint8Array} Os bytes codificados
 *
 * Exemplo:
 *   stringToUint8("abc") // Uint8Array([97,98,99])
 */
export function stringToUint8(data: string): Uint8Array {
  return new TextEncoder().encode(data);
}
