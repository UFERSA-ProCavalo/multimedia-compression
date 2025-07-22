/**
 * Tipos e funções utilitárias para visualização passo a passo do algoritmo RLE.
 * Todos os comentários e descrições estão em pt-br.
 *
 * Este módulo permite gerar uma lista de "passos" intermediários para cada etapa
 * do algoritmo de compressão ou descompressão RLE, para fins de visualização didática.
 * Cada passo inclui o estado do algoritmo, a linha de código destacada e uma descrição.
 *
 * Exemplo de uso:
 *   const steps = getRLECompressSteps("aaabbb");
 *   // steps[0] = { line: ..., state: { i: 0, data: [97,97,97,98,98,98], result: [] }, description: ... }
 *   // Para visualizar cada passo:
 *   for (const step of steps) {
 *     console.log(`Linha: ${step.line}, Estado:`, step.state, step.description);
 *   }
 */

/**
 * Passo do algoritmo de compressão RLE.
 * @typedef {Object} RLECompressStep
 * @property {number|number[]} line - Linha(s) do código a destacar
 * @property {Object} state - Estado atual do algoritmo
 * @property {string} [description] - Descrição do passo
 */
export type RLECompressStep = {
  line: number | number[];
  state: {
    i: number;
    count?: number;
    data: number[];
    result: number[];
  };
  description?: string;
};

/**
 * Passo do algoritmo de descompressão RLE.
 * @typedef {Object} RLEDecompressStep
 * @property {number|number[]} line - Linha(s) do código a destacar
 * @property {Object} state - Estado atual do algoritmo
 * @property {string} [description] - Descrição do passo
 */
export type RLEDecompressStep = {
  line: number | number[];
  state: {
    i: number;
    count?: number;
    value?: number;
    input: number[];
    result: number[];
    j?: number;
  };
  description?: string;
};

// Offset para alinhar as linhas do código exibido com o código fonte real
const COMPRESS_CODE_OFFSET = 10; // bloco começa na linha 13
const DECOMPRESS_CODE_OFFSET = 27; // bloco começa na linha 29

/**
 * Gera os passos para visualização da compressão RLE.
 *
 * Simula a execução do algoritmo de compressão, registrando cada etapa relevante
 * (inicialização, loops, incrementos, atualizações de resultado) para visualização.
 *
 * @param {Uint8Array | string} input - Entrada para compressão
 * @returns {RLECompressStep[]} Lista de passos
 *
 * Exemplo:
 *   const steps = getRLECompressSteps("aaabbb");
 *   // steps.forEach(s => console.log(s));
 */
export function getRLECompressSteps(input: Uint8Array | string): RLECompressStep[] {
  const data = typeof input === 'string' ? Array.from(new TextEncoder().encode(input)) : Array.from(input);
  const result: number[] = [];
  let i = 0;
  const steps: RLECompressStep[] = [];

  steps.push({
    line: 13 - COMPRESS_CODE_OFFSET,
    state: { i, data: [...data], result: [] },
    description: 'Inicializa data a partir da entrada',
  });
  steps.push({
    line: 14 - COMPRESS_CODE_OFFSET,
    state: { i, data: [...data], result: [] },
    description: 'Inicializa o array result',
  });
  steps.push({
    line: 15 - COMPRESS_CODE_OFFSET,
    state: { i, data: [...data], result: [] },
    description: 'Define i = 0',
  });

  while (i < data.length) {
    steps.push({
      line: 16 - COMPRESS_CODE_OFFSET,
      state: { i, data: [...data], result: [...result] },
      description: `Início do while: i = ${i}`,
    });
    let count = 1;
    steps.push({
      line: 17 - COMPRESS_CODE_OFFSET,
      state: { i, count, data: [...data], result: [...result] },
      description: 'Define count = 1',
    });
    while (i + count < data.length && data[i] === data[i + count] && count < 255) {
      steps.push({
        line: 18 - COMPRESS_CODE_OFFSET,
        state: { i, count, data: [...data], result: [...result] },
        description: `Verifica repetição: i=${i}, count=${count}`,
      });
      count++;
      steps.push({
        line: 19 - COMPRESS_CODE_OFFSET,
        state: { i, count, data: [...data], result: [...result] },
        description: `Incrementa count: count=${count}`,
      });
    }
    steps.push({
      line: 21 - COMPRESS_CODE_OFFSET,
      state: { i, count, data: [...data], result: [...result, count, data[i]] },
      description: `Adiciona (count, valor): (${count}, ${data[i]})`,
    });
    result.push(count, data[i]);
    steps.push({
      line: 22 - COMPRESS_CODE_OFFSET,
      state: { i: i + count, data: [...data], result: [...result] },
      description: `Incrementa i por count: i = ${i + count}`,
    });
    i += count;
  }
  steps.push({
    line: 24 - COMPRESS_CODE_OFFSET,
    state: { i, data: [...data], result: [...result] },
    description: 'Retorna o resultado',
  });
  return steps;
}

/**
 * Gera os passos para visualização da descompressão RLE.
 *
 * Simula a execução do algoritmo de descompressão, registrando cada etapa relevante
 * (loops, leituras, adições ao resultado) para visualização.
 *
 * @param {Uint8Array} input - Entrada para descompressão
 * @returns {RLEDecompressStep[]} Lista de passos
 *
 * Exemplo:
 *   const steps = getRLEDecompressSteps(Uint8Array.from([3,97,3,98]));
 *   // steps.forEach(s => console.log(s));
 */
export function getRLEDecompressSteps(input: Uint8Array): RLEDecompressStep[] {
  const arr = Array.from(input);
  const result: number[] = [];
  let i = 0;
  const steps: RLEDecompressStep[] = [];

  steps.push({
    line: 30 - DECOMPRESS_CODE_OFFSET,
    state: { i, input: [...arr], result: [] },
    description: 'Inicializa o array result',
  });

  for (i = 0; i < arr.length; i += 2) {
    steps.push({
      line: 31 - DECOMPRESS_CODE_OFFSET,
      state: { i, input: [...arr], result: [...result] },
      description: `Início do for: i = ${i}`,
    });
    const count = arr[i];
    steps.push({
      line: 32 - DECOMPRESS_CODE_OFFSET,
      state: { i, count, input: [...arr], result: [...result] },
      description: `Lê count: ${count}`,
    });
    const value = arr[i + 1];
    steps.push({
      line: 33 - DECOMPRESS_CODE_OFFSET,
      state: { i, count, value, input: [...arr], result: [...result] },
      description: `Lê valor: ${value}`,
    });
    for (let j = 0; j < count; j++) {
      steps.push({
        line: 34 - DECOMPRESS_CODE_OFFSET,
        state: { i, count, value, j, input: [...arr], result: [...result] },
        description: `Início do for interno: j = ${j}`,
      });
      steps.push({
        line: 35 - DECOMPRESS_CODE_OFFSET,
        state: { i, count, value, j, input: [...arr], result: [...result, value] },
        description: `Adiciona valor: ${value}`,
      });
      result.push(value);
    }
  }
  steps.push({
    line: 38 - DECOMPRESS_CODE_OFFSET,
    state: { i, input: [...arr], result: [...result] },
    description: 'Retorna o resultado',
  });
  return steps;
}
