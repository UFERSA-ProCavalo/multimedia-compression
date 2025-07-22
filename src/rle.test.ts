import { rleCompress, rleDecompress, uint8ToString, stringToUint8 } from "./rle";

describe("RLE (Codificação de Comprimento de Execução)", () => {
  it("deve comprimir e descomprimir uma string", () => {
    const input = "aaabbbccccccddde";
    const bytes = stringToUint8(input);
    const compressed = rleCompress(bytes);
    const decompressed = rleDecompress(compressed);
    const result = uint8ToString(decompressed);
    expect(result).toBe(input);
  });

  it("deve lidar com caracteres únicos", () => {
    const input = "abc";
    const compressed = rleCompress(input);
    const decompressed = rleDecompress(compressed);
    expect(uint8ToString(decompressed)).toBe(input);
  });

  it("deve lidar com entrada vazia", () => {
    const input = "";
    const compressed = rleCompress(input);
    const decompressed = rleDecompress(compressed);
    expect(uint8ToString(decompressed)).toBe(input);
  });

  it("deve funcionar com dados binários", () => {
    const input = new Uint8Array([1,1,1,2,2,3,3,3,3,3,4]);
    const compressed = rleCompress(input);
    const decompressed = rleDecompress(compressed);
    expect(Array.from(decompressed)).toEqual(Array.from(input));
  });
});
