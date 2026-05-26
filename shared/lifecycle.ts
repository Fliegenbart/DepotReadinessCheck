export interface LifecycleAssumptions {
  enabled: boolean;
  dieselPriceIncreasePercentAnnual: number;
  electricityPriceIncreasePercentAnnual: number;
  dieselTollCostPerKm: number;
  electricTollCostPerKm: number;
  tollIncreasePercentAnnual: number;
  publicChargingDiscountPercent: number;
}

export const defaultLifecycleAssumptions: LifecycleAssumptions = {
  enabled: false,
  dieselPriceIncreasePercentAnnual: 3,
  electricityPriceIncreasePercentAnnual: 1.5,
  dieselTollCostPerKm: 0.18,
  electricTollCostPerKm: 0.03,
  tollIncreasePercentAnnual: 2,
  publicChargingDiscountPercent: 0,
};

function clampPercent(value: number) {
  return Math.min(Math.max(value, -100), 100);
}

function clampCost(value: number) {
  return Math.max(0, value);
}

function growthFactor(percent: number, year: number) {
  const periods = Math.max(0, year - 1);
  return Math.pow(1 + clampPercent(percent) / 100, periods);
}

export function normalizeLifecycleAssumptions(
  assumptions?: Partial<LifecycleAssumptions>,
): LifecycleAssumptions {
  return {
    ...defaultLifecycleAssumptions,
    ...(assumptions || {}),
  };
}

export function calculateAnnualLifecycleCosts(args: {
  year: number;
  annualMileage: number;
  fuelUnitsPerYear: number;
  baseFuelCostPerUnit: number;
  isElectric: boolean;
  lifecycleAssumptions?: Partial<LifecycleAssumptions>;
}) {
  const assumptions = normalizeLifecycleAssumptions(args.lifecycleAssumptions);
  const baseFuelCost = clampCost(args.fuelUnitsPerYear) * clampCost(args.baseFuelCostPerUnit);

  if (!assumptions.enabled) {
    return {
      fuelCost: baseFuelCost,
      tollCost: 0,
      effectiveFuelCostPerUnit: clampCost(args.baseFuelCostPerUnit),
    };
  }

  const fuelGrowth = args.isElectric
    ? assumptions.electricityPriceIncreasePercentAnnual
    : assumptions.dieselPriceIncreasePercentAnnual;
  const tollCostPerKm = args.isElectric
    ? assumptions.electricTollCostPerKm
    : assumptions.dieselTollCostPerKm;
  const discountFactor = args.isElectric
    ? 1 - clampPercent(assumptions.publicChargingDiscountPercent) / 100
    : 1;
  const effectiveFuelCostPerUnit =
    clampCost(args.baseFuelCostPerUnit) * growthFactor(fuelGrowth, args.year) * Math.max(0, discountFactor);

  return {
    fuelCost: clampCost(args.fuelUnitsPerYear) * effectiveFuelCostPerUnit,
    tollCost:
      clampCost(args.annualMileage) *
      clampCost(tollCostPerKm) *
      growthFactor(assumptions.tollIncreasePercentAnnual, args.year),
    effectiveFuelCostPerUnit,
  };
}
