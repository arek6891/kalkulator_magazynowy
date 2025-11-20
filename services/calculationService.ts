import { WarehouseData, CalculationResult } from '../types';

export const calculateWorkforce = (data: WarehouseData): CalculationResult => {
  // 1. Defensive Destructuring & Default Values
  // Ensures we don't crash if data is null/undefined or fields are missing
  const {
    deliveries = 0,
    deliveriesPerHour = 0,
    orders = 0,
    itemsPerOrder = 0,
    itemsPickedPerHour = 0,
    ordersPackedPerHour = 0,
    workHours = 0,
    currentEmployees = 0,
    breakTime = 30, 
    processEfficiency = 85
  } = data || {};

  // Standard "Empty/Error" Result
  const safeZeroResult: CalculationResult = {
    receivers: 0, pickers: 0, packers: 0, total: 0, buffer: 0, needed: 0, effectiveWorkHours: 0
  };

  // 2. Basic Validation
  // Check for invalid numbers (NaN) or non-positive shift duration
  if (isNaN(workHours) || workHours <= 0) {
    return safeZeroResult;
  }

  // 3. Calculate Net Available Time per Person (Logistics Standard)
  // Nominal Hours - Breaks = Net Hours
  const breakHours = (breakTime || 0) / 60;
  
  // Safety check: Breaks cannot be longer than the shift itself
  if (breakHours >= workHours) {
      return safeZeroResult;
  }

  const netAvailableHours = Math.max(0, workHours - breakHours);
  
  // 4. Apply Process Efficiency (OEE / Utilization)
  // Ensure efficiency is positive to prevent division by zero later
  const safeEfficiency = Math.max(0, (processEfficiency || 85)); 
  const efficiencyFactor = safeEfficiency / 100;
  
  // Check if efficiency factor is effectively zero to avoid division issues
  if (efficiencyFactor <= 0.01) {
      return safeZeroResult;
  }

  const effectiveProductiveHoursPerPerson = netAvailableHours * efficiencyFactor;

  // 5. Calculate Workload in Man-Hours (Standard Hours)
  // Handle Division by Zero for Norms: If norm is 0, but volume > 0, technically FTE is Infinity.
  // For UI safety, we treat 0 norm as 0 workload required (or user needs to correct input).
  
  const receivingManHours = (deliveries > 0 && deliveriesPerHour > 0) 
    ? deliveries / deliveriesPerHour 
    : 0;
  
  const totalItemsToPick = orders * itemsPerOrder;
  const pickingManHours = (totalItemsToPick > 0 && itemsPickedPerHour > 0) 
    ? totalItemsToPick / itemsPickedPerHour 
    : 0;
  
  const packingManHours = (orders > 0 && ordersPackedPerHour > 0) 
    ? orders / ordersPackedPerHour 
    : 0;

  // 6. Calculate FTE (Full Time Equivalent) Required
  // Formula: Workload Hours / Effective Productive Hours per Person
  // We already ensured effectiveProductiveHoursPerPerson > 0 above.
  
  const receiversRequired = receivingManHours / effectiveProductiveHoursPerPerson;
  const pickersRequired = pickingManHours / effectiveProductiveHoursPerPerson;
  const packersRequired = packingManHours / effectiveProductiveHoursPerPerson;

  // Rounding strategy: In logistics planning for headcount, we round up to ensure coverage.
  const finalReceivers = Math.ceil(receiversRequired);
  const finalPickers = Math.ceil(pickersRequired);
  const finalPackers = Math.ceil(packersRequired);

  const totalRequired = finalReceivers + finalPickers + finalPackers;
  
  // Calculate "Buffer" / Overhead
  // Comparison: How many people would be needed if they were robots (100% efficiency, no breaks)
  // vs how many are needed realistically.
  const rawReceivers = receivingManHours / workHours;
  const rawPickers = pickingManHours / workHours;
  const rawPackers = packingManHours / workHours;
  const totalRaw = Math.ceil(rawReceivers + rawPickers + rawPackers);
  
  const impliedBuffer = Math.max(0, totalRequired - totalRaw);
  const needed = Math.max(0, totalRequired - currentEmployees);

  return {
    receivers: finalReceivers,
    pickers: finalPickers,
    packers: finalPackers,
    total: totalRequired,
    buffer: impliedBuffer, // Represents staff added due to breaks and efficiency loss
    needed: needed,
    effectiveWorkHours: Number(effectiveProductiveHoursPerPerson.toFixed(2))
  };
};