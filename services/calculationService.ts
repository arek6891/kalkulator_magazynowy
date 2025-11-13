
import { WarehouseData, CalculationResult } from '../types';

const WORKER_EFFICIENCY_BUFFER = 0.15; // 15% buffer for breaks, inefficiencies etc.

export const calculateWorkforce = (data: WarehouseData): CalculationResult => {
  const {
    deliveries,
    deliveriesPerHour,
    orders,
    itemsPerOrder,
    itemsPickedPerHour,
    ordersPackedPerHour,
    workHours,
    currentEmployees,
  } = data;

  if (workHours <= 0) {
    return { receivers: 0, pickers: 0, packers: 0, total: 0, buffer: 0, needed: 0 };
  }

  // Calculate required hours for each task
  const totalReceivingHours = deliveriesPerHour > 0 ? deliveries / deliveriesPerHour : 0;
  
  const totalItemsToPick = orders * itemsPerOrder;
  const totalPickingHours = itemsPickedPerHour > 0 ? totalItemsToPick / itemsPickedPerHour : 0;
  
  const totalPackingHours = ordersPackedPerHour > 0 ? orders / ordersPackedPerHour : 0;

  // Calculate raw number of workers for the shift
  const rawReceivers = totalReceivingHours / workHours;
  const rawPickers = totalPickingHours / workHours;
  const rawPackers = totalPackingHours / workHours;

  const totalRawWorkers = rawReceivers + rawPickers + rawPackers;
  const bufferWorkers = totalRawWorkers * WORKER_EFFICIENCY_BUFFER;

  const calculatedReceivers = Math.ceil(rawReceivers + (bufferWorkers * (rawReceivers / totalRawWorkers || 0)));
  const calculatedPickers = Math.ceil(rawPickers + (bufferWorkers * (rawPickers / totalRawWorkers || 0)));
  const calculatedPackers = Math.ceil(rawPackers + (bufferWorkers * (rawPackers / totalRawWorkers || 0)));
  
  const totalWithBuffer = calculatedReceivers + calculatedPickers + calculatedPackers;
  const needed = Math.max(0, totalWithBuffer - currentEmployees);

  return {
    receivers: isNaN(calculatedReceivers) ? 0 : calculatedReceivers,
    pickers: isNaN(calculatedPickers) ? 0 : calculatedPickers,
    packers: isNaN(calculatedPackers) ? 0 : calculatedPackers,
    total: isNaN(totalWithBuffer) ? 0 : totalWithBuffer,
    buffer: Math.round(bufferWorkers),
    needed: isNaN(needed) ? 0 : needed,
  };
};