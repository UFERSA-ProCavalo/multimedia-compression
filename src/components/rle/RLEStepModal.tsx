import { useState, useEffect, useRef } from "react";
import type { RLECompressStep, RLEDecompressStep } from "../../lib/rle-steps";
import { uint8ToString } from "../../rle";

/**
 * Propriedades do componente RLEStepModal.
 * @typedef {Object} RLEStepModalProps
 * @property {boolean} open - Se o modal está aberto
 * @property {(open: boolean) => void} onOpenChange - Função para abrir/fechar o modal
 * @property {(RLECompressStep | RLEDecompressStep)[]} steps - Lista de passos do algoritmo
 * @property {string[]} codeLines - Linhas do código fonte para exibir
 * @property {string} title - Título do modal
 */
type RLEStepModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  steps: (RLECompressStep | RLEDecompressStep)[];
  codeLines: string[];
  title: string;
};

/**
 * Modal de visualização passo a passo do algoritmo RLE.
 *
 * @param {RLEStepModalProps} props
 * @returns {JSX.Element | null}
 */
export function RLEStepModal({ open, onOpenChange, steps, codeLines, title }: RLEStepModalProps) {
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const playRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!open) setStepIdx(0);
  }, [open]);

  useEffect(() => {
    if (playing) {
      playRef.current = setTimeout(() => {
        setStepIdx((idx) => (idx < steps.length - 1 ? idx + 1 : idx));
      }, 800);
    } else if (playRef.current) {
      clearTimeout(playRef.current);
    }
    return () => { if (playRef.current) clearTimeout(playRef.current); };
  }, [playing, stepIdx, steps.length]);

  if (!open) return null;
  if (!steps.length) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-md mx-auto text-center">
          <h2 className="text-xl font-bold mb-4">{title} — Passo a Passo</h2>
          <div className="mb-4 text-zinc-700 dark:text-zinc-300">Nenhum passo para mostrar. Por favor, envie um arquivo ou forneça uma entrada válida.</div>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition-colors"
          >Fechar</button>
        </div>
      </div>
    );
  }
   const step = steps[stepIdx];
   const highlightLines = Array.isArray(step.line) ? step.line : [step.line];

   // Calcula a string final se for o último passo e houver resultado
   let finalString = "";
   if (
     stepIdx === steps.length - 1 &&
     step &&
     Array.isArray(step.state.result) &&
     step.state.result.length > 0
   ) {
     try {
       finalString = uint8ToString(Uint8Array.from(step.state.result));
     } catch {
       finalString = "";
     }
   }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-screen mx-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">{title} — Passo {stepIdx + 1} / {steps.length}</h2>
          <button onClick={() => onOpenChange(false)} className="text-lg">×</button>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Bloco de código com destaque de linha */}
          <pre className="bg-zinc-900 text-white rounded p-4 text-xs flex-1 min-w-0 overflow-auto">
            {codeLines.map((line: string, idx: number) => (
              <div
                key={idx}
                className={
                  highlightLines.includes(idx + 1)
                    ? "bg-yellow-200 text-black rounded px-1"
                    : ""
                }
                style={{ minHeight: "1.2em" }}
              >
                <span className="opacity-50 select-none mr-2">{String(idx + 1).padStart(2, "0")}</span>
                {line}
              </div>
            ))}
          </pre>
          {/* Painel de estado/saída */}
           <div className="bg-muted rounded p-4 flex-1 min-w-0 overflow-auto">
            <div className="font-semibold mb-2">Estado</div>
            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(step.state, function inlineArrayReplacer(_key, value) {
              // Para truncar arrays, descomente as linhas abaixo
              // const arr = value.length > 20 ? value.slice(0, 20).concat('…') : value;
              // return `[${arr.join(', ')}]`;
              return Array.isArray(value) ? `[${value.join(', ')}]` : value;
            }, 2)}</pre>
            {step.description && (
              <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{step.description}</div>
            )}
            {/* Mostra a string final no último passo, se aplicável */}
            {finalString && (
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <span className="font-semibold">String final: </span>
                {finalString}
              </div>
            )}

          </div>        </div>
        {/* Controles */}
        <div className="flex items-center gap-2 mt-4 justify-center">
          <button
            onClick={() => setStepIdx((idx) => Math.max(0, idx - 1))}
            disabled={stepIdx === 0}
            className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-700 disabled:opacity-50"
          >Anterior</button>
          <button
            onClick={() => setPlaying((p) => !p)}
            disabled={steps.length <= 1}
            className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-700"
          >{playing ? "Pausar" : "Reproduzir"}</button>
          <button
            onClick={() => setStepIdx((idx) => Math.min(steps.length - 1, idx + 1))}
            disabled={stepIdx === steps.length - 1}
            className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-700 disabled:opacity-50"
          >Próximo</button>
        </div>
      </div>
    </div>
  );
}
