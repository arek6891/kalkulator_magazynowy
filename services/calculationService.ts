
import { WarehouseData, CalculationResult } from '../types';

export const calculateWorkforce = (data: WarehouseData): CalculationResult => {
  // Standard "Empty/Error" Result builder
  const createErrorResult = (message: string): CalculationResult => ({
    receivers: 0, pickers: 0, packers: 0, total: 0, buffer: 0, needed: 0, effectiveWorkHours: 0,
    error: message
  });

  // 1. Defensive Destructuring & Default Values
  const {
    deliveries = 0,
    itemsPerDelivery = 0,
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

  // 2. Detailed Validation Logic

  // Check for negative values in basic inputs
  if (deliveries < 0 || orders < 0 || currentEmployees < 0) {
      return createErrorResult("Wartości wolumenu lub liczby pracowników nie mogą być ujemne.");
  }

  // Check Norms
  if (deliveriesPerHour < 0 || itemsPickedPerHour < 0 || ordersPackedPerHour < 0) {
      return createErrorResult("Normy wydajnościowe nie mogą być ujemne.");
  }

  // Validate Shift Time
  if (isNaN(workHours) || workHours <= 0) {
    return createErrorResult("Czas zmiany musi być liczbą większą od zera.");
  }

  if (workHours > 24) {
      return createErrorResult("Czas zmiany nie może przekraczać 24 godzin.");
  }

  // Validate Break Time vs Shift Time
  // Convert break minutes to hours for comparison
  const breakHours = (breakTime || 0) / 60;
  if (breakHours >= workHours) {
      return createErrorResult(`Czas przerw (${breakTime} min) jest dłuższy lub równy długości zmiany (${workHours} h). Pracownicy nie mieliby czasu na pracę.`);
  }

  // Validate Efficiency
  if (processEfficiency < 0 || processEfficiency > 100) {
      return createErrorResult("Wydajność procesu musi mieścić się w przedziale 0-100%.");
  }

  // 3. Calculation Core
  const netAvailableHours = Math.max(0, workHours - breakHours);
  
  const safeEfficiency = Math.max(0, (processEfficiency || 85)); 
  const efficiencyFactor = safeEfficiency / 100;
  
  // Prevent division by zero if efficiency is set to 0%
  if (efficiencyFactor <= 0.01) {
      return createErrorResult("Przy wydajności bliskiej 0% zapotrzebowanie na pracowników dąży do nieskończoności. Zwiększ wydajność.");
  }

  const effectiveProductiveHoursPerPerson = netAvailableHours * efficiencyFactor;

  // 4. Calculate Workload in Man-Hours
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

  // 5. Calculate FTE
  const receiversRequired = receivingManHours / effectiveProductiveHoursPerPerson;
  const pickersRequired = pickingManHours / effectiveProductiveHoursPerPerson;
  const packersRequired = packingManHours / effectiveProductiveHoursPerPerson;

  const finalReceivers = Math.ceil(receiversRequired);
  const finalPickers = Math.ceil(pickersRequired);
  const finalPackers = Math.ceil(packersRequired);

  const totalRequired = finalReceivers + finalPickers + finalPackers;
  
  // 6. Calculate Buffer
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
    buffer: impliedBuffer,
    needed: needed,
    effectiveWorkHours: Number(effectiveProductiveHoursPerPerson.toFixed(2))
  };
};
