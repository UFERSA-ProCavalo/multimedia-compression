import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";

interface CodeCardProps {
  rleCode: string;
}

export function CodeCard({ rleCode }: CodeCardProps) {
  return (
    <Card className="h-full min-h-0 flex flex-col flex-1 min-w-0">
      <CardHeader className="shrink-0">
        <CardTitle>RLE Code</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-auto">
        <pre className="bg-muted p-3 rounded text-xs overflow-x-auto w-full block h-full max-h-48 md:max-h-64 lg:max-h-80 xl:max-h-96 min-h-0">
          {rleCode}
        </pre>
      </CardContent>
    </Card>  );
}
