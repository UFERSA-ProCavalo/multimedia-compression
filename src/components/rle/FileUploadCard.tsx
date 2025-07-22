import React from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";

interface FileUploadCardProps {
  file: File | null;
  mode: "compress" | "decompress";
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onModeChange: (mode: "compress" | "decompress") => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  onDownload: () => void;
  fileData: Uint8Array | null;
  result: Uint8Array | null;
  error: string | null;
}

export function FileUploadCard({
  file,
  mode,
  fileInputRef,
  onModeChange,
  onFileChange,

  onDownload,
  fileData,
  result,
  error,
}: FileUploadCardProps) {
  return (
    <Card className="h-72 flex flex-col">
      <CardHeader className="shrink-0">
        <CardTitle>Envio de Arquivo & Ação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2">
          <div className="flex gap-4 items-center mb-2">
            <Label htmlFor="mode-compress">
              <input
                id="mode-compress"
                type="radio"
                name="mode"
                checked={mode === "compress"}
                onChange={() => onModeChange("compress")}
                className="mr-1"
              />
              Comprimir
            </Label>
            <Label htmlFor="mode-decompress">
              <input
                id="mode-decompress"
                type="radio"
                name="mode"
                checked={mode === "decompress"}
                onChange={() => onModeChange("decompress")}
                className="mr-1"
              />
              Descomprimir
            </Label>
          </div>
          <input
            id="file"
            type="file"
            className="hidden"
            onChange={onFileChange}
            ref={fileInputRef}
          />
          <Button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
            {file ? file.name : "Selecionar Arquivo"}
          </Button>
        </div>
        {file && (
          <div className="flex gap-4 items-center">
            <Button
              variant="outline"
              onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('show-steps-modal'))}
              disabled={!fileData}
            >
              Mostrar Passos
            </Button>
            {result && (
              <Button
                variant="secondary"
                onClick={onDownload}
              >
                Baixar Resultado
              </Button>
            )}
          </div>
        )}
        {file && (
          <ul className="text-sm mt-2">
            <li>Original: {fileData ? `${fileData.length} B` : '-'}</li>
            <li>Resultado: {result ? `${result.length} B` : '-'}</li>
            {fileData && result && (
              <li>Taxa de Compressão: {(result.length / fileData.length).toFixed(2)}</li>
            )}
          </ul>
        )}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </CardContent>
    </Card>
  );
}
