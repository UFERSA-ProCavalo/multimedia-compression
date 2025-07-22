
import { Dialog } from "../ui/dialog";

export function InfoModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col items-center gap-2">
        <div className="text-3xl mb-2">❓</div>
        <h2 className="text-lg font-bold mb-2 text-center">Atenção: Visualização Passo a Passo</h2>
        <ul className="text-sm text-left list-disc pl-5 mb-2">
          <li>O modo de visualização passo a passo só funciona bem para arquivos de texto pequenos.</li>
          <li>Se tentar usar com imagens ou arquivos grandes, o navegador pode travar ou até crashar.</li>
          <li>Imagens podem acabar <b>maiores</b> após a compressão, pois o algoritmo só é eficiente quando há longas sequências de bytes iguais.</li>
          <li>Imagens ideais para compressão RLE: ícones, desenhos simples, imagens com grandes áreas de cor sólida.</li>
        </ul>
        <div className="text-xs text-zinc-500 text-center">
          Dúvidas? Clique no ícone <b>?</b> no topo da página para rever este aviso.
        </div>
      </div>
    </Dialog>
  );
}
