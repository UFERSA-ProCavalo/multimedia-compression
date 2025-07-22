import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";

interface PseudocodeCardProps {
  rlePseudocode: string;
}

export function PseudocodeCard({ rlePseudocode }: PseudocodeCardProps) {
  return (
    <Card className="h-full min-h-0 flex flex-col flex-1 min-w-0">
      <CardHeader className="shrink-0">
        <CardTitle>RLE Pseudocode</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-auto">
        <pre className="bg-muted p-3 rounded text-xs overflow-x-auto w-full h-full max-h-48 md:max-h-64 lg:max-h-80 xl:max-h-96 min-h-0">
          {rlePseudocode}
        </pre>
      </CardContent>
    </Card>  );
}
