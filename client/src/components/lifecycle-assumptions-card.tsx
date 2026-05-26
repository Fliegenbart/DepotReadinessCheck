import { TrendingUp } from "lucide-react";
import { defaultLifecycleAssumptions } from "@shared/lifecycle";
import type { LifecycleAssumptions } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface LifecycleAssumptionsCardProps {
  value: LifecycleAssumptions;
  onChange: (value: LifecycleAssumptions) => void;
}

export function LifecycleAssumptionsCard({ value, onChange }: LifecycleAssumptionsCardProps) {
  const assumptions = { ...defaultLifecycleAssumptions, ...value };

  const setField = <K extends keyof LifecycleAssumptions>(field: K, next: LifecycleAssumptions[K]) => {
    onChange({ ...assumptions, [field]: next });
  };

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="space-y-2 pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Lifecycle-Annahmen
            </CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              Energiepfade, Maut und Ladepreis-Effekte über die Laufzeit.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="lifecycle-enabled" className="text-sm font-medium">
              Aktiv
            </Label>
            <Switch
              id="lifecycle-enabled"
              checked={assumptions.enabled}
              onCheckedChange={(checked) => setField("enabled", checked)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className={assumptions.enabled ? "space-y-6" : "space-y-6 opacity-50"}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="diesel-growth" className="text-xs uppercase tracking-wider font-medium">
              Dieselpreis/Jahr (%)
            </Label>
            <Input
              id="diesel-growth"
              type="number"
              step="0.1"
              value={assumptions.dieselPriceIncreasePercentAnnual}
              disabled={!assumptions.enabled}
              onChange={(event) =>
                setField("dieselPriceIncreasePercentAnnual", Number(event.target.value) || 0)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="electricity-growth" className="text-xs uppercase tracking-wider font-medium">
              Strompreis/Jahr (%)
            </Label>
            <Input
              id="electricity-growth"
              type="number"
              step="0.1"
              value={assumptions.electricityPriceIncreasePercentAnnual}
              disabled={!assumptions.enabled}
              onChange={(event) =>
                setField("electricityPriceIncreasePercentAnnual", Number(event.target.value) || 0)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="charging-discount" className="text-xs uppercase tracking-wider font-medium">
              Laderabatt (%)
            </Label>
            <Input
              id="charging-discount"
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={assumptions.publicChargingDiscountPercent}
              disabled={!assumptions.enabled}
              onChange={(event) =>
                setField("publicChargingDiscountPercent", Number(event.target.value) || 0)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diesel-toll" className="text-xs uppercase tracking-wider font-medium">
              Diesel Maut/CO2 (EUR/km)
            </Label>
            <Input
              id="diesel-toll"
              type="number"
              min="0"
              step="0.01"
              value={assumptions.dieselTollCostPerKm}
              disabled={!assumptions.enabled}
              onChange={(event) => setField("dieselTollCostPerKm", Number(event.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="electric-toll" className="text-xs uppercase tracking-wider font-medium">
              Elektro Maut/CO2 (EUR/km)
            </Label>
            <Input
              id="electric-toll"
              type="number"
              min="0"
              step="0.01"
              value={assumptions.electricTollCostPerKm}
              disabled={!assumptions.enabled}
              onChange={(event) => setField("electricTollCostPerKm", Number(event.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="toll-growth" className="text-xs uppercase tracking-wider font-medium">
              Mautsteigerung/Jahr (%)
            </Label>
            <Input
              id="toll-growth"
              type="number"
              step="0.1"
              value={assumptions.tollIncreasePercentAnnual}
              disabled={!assumptions.enabled}
              onChange={(event) => setField("tollIncreasePercentAnnual", Number(event.target.value) || 0)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
