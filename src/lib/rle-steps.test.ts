import { getRLECompressSteps, getRLEDecompressSteps } from "./rle-steps";

// Testes para getRLECompressSteps

describe("getRLECompressSteps", () => {
  it("deve gerar os passos corretos para uma string simples", () => {
    const entrada = "aaabb";
    const passos = getRLECompressSteps(entrada);

    // O primeiro passo deve ser a inicialização dos dados
    expect(passos[0].description).toMatch(/Inicializa data/);
    expect(passos[0].state.data).toEqual([97, 97, 97, 98, 98]);

    // Deve haver um passo que adiciona (count, valor) para 'a'
    const passoA = passos.find(
      (p) => p.description && p.description.includes("(count, valor): (3, 97)")
    );
    expect(passoA).toBeDefined();
    expect(passoA?.state.result).toEqual([3, 97]);

    // Deve haver um passo que adiciona (count, valor) para 'b'
    const passoB = passos.find(
      (p) => p.description && p.description.includes("(count, valor): (2, 98)")
    );
    expect(passoB).toBeDefined();
    expect(passoB?.state.result).toEqual([3, 97, 2, 98]);

    // O último passo deve retornar o resultado final
    expect(passos[passos.length - 1].description).toMatch(/Retorna o resultado/);
    expect(passos[passos.length - 1].state.result).toEqual([3, 97, 2, 98]);
  });

  it("deve lidar com entrada vazia", () => {
    const passos = getRLECompressSteps("");
    expect(passos.some(p => p.description?.match(/Retorna o resultado/))).toBe(true);
    expect(passos[passos.length - 1].state.result).toEqual([]);
  });
});

// Testes para getRLEDecompressSteps
describe("getRLEDecompressSteps", () => {
  it("deve gerar os passos corretos para uma entrada comprimida simples", () => {
    const entrada = Uint8Array.from([3, 97, 2, 98]);
    const passos = getRLEDecompressSteps(entrada);

    // O primeiro passo deve ser a inicialização do array result
    expect(passos[0].description).toMatch(/Inicializa o array result/);
    expect(passos[0].state.result).toEqual([]);

    // Deve haver um passo que adiciona valor 97 três vezes
    const passoA = passos.find(
      (p) => p.description && p.description.includes("Adiciona valor: 97")
    );
    expect(passoA).toBeDefined();

    // Deve haver um passo que adiciona valor 98 duas vezes
    const passoB = passos.find(
      (p) => p.description && p.description.includes("Adiciona valor: 98")
    );
    expect(passoB).toBeDefined();

    // O último passo deve retornar o resultado final
    expect(passos[passos.length - 1].description).toMatch(/Retorna o resultado/);
    expect(passos[passos.length - 1].state.result).toEqual([97, 97, 97, 98, 98]);
  });

  it("deve lidar com entrada vazia", () => {
    const passos = getRLEDecompressSteps(Uint8Array.from([]));
    expect(passos.some(p => p.description?.match(/Retorna o resultado/))).toBe(true);
    expect(passos[passos.length - 1].state.result).toEqual([]);
  });
});
