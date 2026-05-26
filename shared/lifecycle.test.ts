import assert from "node:assert/strict";
import { calculateAnnualLifecycleCosts } from "./lifecycle";

const baseArgs = {
  year: 1,
  annualMileage: 100_000,
  fuelUnitsPerYear: 30_000,
  baseFuelCostPerUnit: 1.5,
  isElectric: false,
  lifecycleAssumptions: {
    enabled: true,
    dieselPriceIncreasePercentAnnual: 5,
    electricityPriceIncreasePercentAnnual: 2,
    dieselTollCostPerKm: 0.15,
    electricTollCostPerKm: 0.03,
    tollIncreasePercentAnnual: 10,
    publicChargingDiscountPercent: 0,
  },
};

const dieselYear1 = calculateAnnualLifecycleCosts(baseArgs);
assert.equal(dieselYear1.fuelCost, 45_000);
assert.equal(dieselYear1.tollCost, 15_000);

const dieselYear3 = calculateAnnualLifecycleCosts({ ...baseArgs, year: 3 });
assert.equal(Math.round(dieselYear3.fuelCost), 49_613);
assert.equal(Math.round(dieselYear3.tollCost), 18_150);

const electricYear2 = calculateAnnualLifecycleCosts({
  ...baseArgs,
  year: 2,
  fuelUnitsPerYear: 120_000,
  baseFuelCostPerUnit: 0.4,
  isElectric: true,
});
assert.equal(Math.round(electricYear2.fuelCost), 48_960);
assert.equal(Math.round(electricYear2.tollCost), 3_300);

const discountedElectric = calculateAnnualLifecycleCosts({
  ...baseArgs,
  isElectric: true,
  baseFuelCostPerUnit: 0.5,
  fuelUnitsPerYear: 100_000,
  lifecycleAssumptions: {
    ...baseArgs.lifecycleAssumptions,
    publicChargingDiscountPercent: 20,
  },
});
assert.equal(discountedElectric.fuelCost, 40_000);

const disabledLifecycle = calculateAnnualLifecycleCosts({
  ...baseArgs,
  year: 3,
  lifecycleAssumptions: { ...baseArgs.lifecycleAssumptions, enabled: false },
});
assert.equal(disabledLifecycle.fuelCost, 45_000);
assert.equal(disabledLifecycle.tollCost, 0);
