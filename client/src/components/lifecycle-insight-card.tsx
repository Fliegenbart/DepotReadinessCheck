import { Gauge, PiggyBank, Route } from "lucide-react";
import type { ComparisonResult, LifecycleAssumptions } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LifecycleInsightCardProps {
  result: ComparisonResult;
  lifecycleAssumptions: LifecycleAssumptions;
  fleetSize?: number;
}

export function LifecycleInsightCard({
  result,
  lifecycleAssumptions,
  fleetSize = 1,
}: LifecycleInsightCardProps) {
  if (!lifecycleAssumptions.enabled) {
    return null;
  }

  const bestElectric =
    result.bestElectricOption === "electric1" ? result.electric1Analysis : result.electric2Analysis;
  const tollAdvantage =
    (result.dieselAnalysis.totalTollCost - bestElectric.totalTollCost) * fleetSize;
  const energyAdvantage =
    (result.dieselAnalysis.totalFuelCost - bestElectric.totalFuelCost) * fleetSize;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="border border-border bg-card shadow-none">
      <CardHeader>
        <p className="label-editorial mb-2">Lifecycle</p>
        <CardTitle className="font-serif text-xl font-medium">Kostenentwicklung</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 border border-border">
          <div className="p-5 border-b md:border-b-0 md:border-r border-border">
            <div className="mb-4 flex h-9 w-9 items-center justify-center border border-border text-primary">
              <Route className="h-4 w-4" />
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Maut / CO2</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">
              {formatCurrency(tollAdvantage)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Vorteil gegen Diesel</p>
          </div>

          <div className="p-5 border-b md:border-b-0 md:border-r border-border">
            <div className="mb-4 flex h-9 w-9 items-center justify-center border border-border text-primary">
              <Gauge className="h-4 w-4" />
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Energiepfad</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">
              {formatCurrency(energyAdvantage)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Kraftstoff/Strom-Differenz</p>
          </div>

          <div className="p-5">
            <div className="mb-4 flex h-9 w-9 items-center justify-center border border-border text-primary">
              <PiggyBank className="h-4 w-4" />
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Ladevertrag</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">
              {lifecycleAssumptions.publicChargingDiscountPercent.toLocaleString("de-DE", {
                maximumFractionDigits: 1,
              })}
              %
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Preisvorteil auf E-Energie</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
