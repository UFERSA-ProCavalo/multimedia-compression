import React, { useState } from "react";
import { rleCompress, rleDecompress } from "./rle";

import { FileUploadCard } from "./components/rle/FileUploadCard";

import { CodeCard } from "./components/rle/CodeCard";
import { PseudocodeCard } from "./components/rle/PseudocodeCard";

import { RLEStepModal } from "./components/rle/RLEStepModal";
import { InfoModal } from "./components/rle/InfoModal";
import { getRLECompressSteps, getRLEDecompressSteps } from "./lib/rle-steps";

const rleCompressCode = `// RLE compression
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
}`;

const rleDecompressCode = `// RLE decompression
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
}`;

const rleCompressPseudocode = `RLE Compress:
  For each byte in input:
    Count how many times it repeats (max 255)
    Output (count, value)`;

const rleDecompressPseudocode = `RLE Decompress:
  For each (count, value) pair in input:
    Output 'value' repeated 'count' times`;

export default function RLEPage() {
  const [infoOpen, setInfoOpen] = useState(true);
  const [stepModalEnabled, setStepModalEnabled] = useState(true);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [mode, setMode] = useState<'compress' | 'decompress'>('compress');
  const [error, setError] = useState<string | null>(null);
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [tab, setTab] = useState<'compression' | 'decompression'>('compression');
  React.useEffect(() => {
    const handler = () => setShowStepsModal(true);
    window.addEventListener('show-steps-modal', handler);
    return () => window.removeEventListener('show-steps-modal', handler);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResult(null);
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      f.arrayBuffer().then(buf => setFileData(new Uint8Array(buf)));
    } else {
      setFileData(null);
    }
  };

  React.useEffect(() => {
    if (!fileData) return;
    try {
      if (mode === 'compress') {
        setResult(rleCompress(fileData));
      } else {
        setResult(rleDecompress(fileData));
      }
    } catch (e) {
      setError('Falha ao processar o arquivo. ' + e);
    }
  }, [fileData, mode]);

  const handleDownload = () => {
    if (!result || !file) return;
    const blob = new Blob([result], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name + (mode === 'compress' ? '.rle' : '.descomprimido');
    a.click();
    URL.revokeObjectURL(url);
  };

   return (
     <main className="w-full min-h-screen max-h-screen flex flex-col bg-background">
       <InfoModal open={infoOpen} onOpenChange={setInfoOpen} />
       <div className="absolute top-4 right-4 z-50">
         <button
           className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xl font-bold shadow hover:bg-zinc-300 dark:hover:bg-zinc-700"
           title="Ajuda / Sobre o passo a passo"
           onClick={() => setInfoOpen(true)}
           aria-label="Ajuda"
         >
           ?
         </button>
       </div>
       <h1 className="text-3xl font-bold mb-4 text-center shrink-0">Compressão e Descompressão RLE</h1>      <div className="flex-1 flex flex-col gap-4 px-2 md:px-8 pb-2 w-full mx-auto">
         {/* Step-by-step toggle */}
         <div className="flex items-center gap-2 mb-2">
           <input
             id="step-modal-toggle"
             type="checkbox"
             checked={stepModalEnabled}
             onChange={e => setStepModalEnabled(e.target.checked)}
           />
           <label htmlFor="step-modal-toggle" className="text-sm select-none cursor-pointer">
             Ativar passo a passo (visualização do algoritmo)
           </label>
         </div>
          {/* Example file buttons */}
          <div className="flex gap-2 mb-4">
            <button
              className="px-4 py-2 rounded bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition-colors"
              onClick={async () => {
                 const base = import.meta.env.BASE_URL || '/';
                 const response = await fetch(`${base}all_gray.bmp`);
                 const blob = await response.blob();
                 const file = new File([blob], 'all_gray.bmp', { type: blob.type });                // Create a synthetic event to reuse handleFileChange
                const dt = new DataTransfer();
                dt.items.add(file);
                if (fileInputRef.current) fileInputRef.current.files = dt.files;
                handleFileChange({ target: { files: dt.files } } as any);
              }}
            >
              Carregar all_gray.bmp
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition-colors"
              onClick={async () => {
                 const base = import.meta.env.BASE_URL || '/';
                 const response = await fetch(`${base}teste.txt`);
                 const blob = await response.blob();
                 const file = new File([blob], 'teste.txt', { type: blob.type });                const dt = new DataTransfer();
                dt.items.add(file);
                if (fileInputRef.current) fileInputRef.current.files = dt.files;
                handleFileChange({ target: { files: dt.files } } as any);
              }}
            >
              Carregar teste.txt
            </button>
          </div>
          {/* File upload and stats */}       
          <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0">
           <div className="flex-1 min-h-0 flex flex-col gap-4">             <FileUploadCard
              file={file}
              mode={mode}
              fileInputRef={fileInputRef}
              onModeChange={(newMode) => {
                setMode(newMode);
                setTab(newMode === 'compress' ? 'compression' : 'decompression');
              }}
              onFileChange={handleFileChange}
              onDownload={handleDownload}
              fileData={fileData}
              result={result}
              error={error}
            />          </div>
        </div>
        {/* Tab menu */}
        <div className="flex justify-center my-2">
          <div className="inline-flex rounded-lg shadow bg-muted overflow-hidden">
            <button
              className={`px-6 py-2 font-medium transition-colors focus:outline-none ${tab === 'compression' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
              onClick={() => setTab('compression')}
              aria-selected={tab === 'compression'}
              role="tab"
            >
              Compressão
            </button>
            <button
              className={`px-6 py-2 font-medium transition-colors focus:outline-none ${tab === 'decompression' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
              onClick={() => setTab('decompression')}
              aria-selected={tab === 'decompression'}
              role="tab"
            >
              Descompressão
            </button>
          </div>
        </div>
         {/* Tab panels */}
            {tab === 'compression' && (
              <div className="flex flex-col md:flex-row gap-4 h-96 min-h-0" role="tabpanel">
                <div className="flex-1 min-h-0 min-w-0">
                  <CodeCard rleCode={rleCompressCode} />
                </div>
                <div className="flex-1 min-h-0 min-w-0">
                  <PseudocodeCard rlePseudocode={rleCompressPseudocode} />
                </div>
              </div>
            )}
            {tab === 'decompression' && (
              <div className="flex flex-col md:flex-row gap-4 h-96 min-h-0" role="tabpanel">
                <div className="flex-1 min-h-0 min-w-0">
                  <CodeCard rleCode={rleDecompressCode} />
                </div>
                <div className="flex-1 min-h-0 min-w-0">
                  <PseudocodeCard rlePseudocode={rleDecompressPseudocode} />
                </div>
              </div>
            )}
         </div>
         {stepModalEnabled && (
           <RLEStepModal
             open={showStepsModal}
             onOpenChange={setShowStepsModal}
             steps={
               tab === 'compression' && fileData
                 ? getRLECompressSteps(fileData)
                 : tab === 'decompression' && fileData
                 ? getRLEDecompressSteps(fileData)
                 : []
             }
             codeLines={
               (tab === 'compression' ? rleCompressCode : rleDecompressCode).split('\n')
             }
             title={tab === 'compression' ? 'Compressão RLE' : 'Descompressão RLE'}
           />
         )}
       </main>     );
}
