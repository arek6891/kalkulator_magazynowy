
import { WarehouseData, CalculationResult } from '../types';

const WORKER_EFFICIENCY_BUFFER = 0.15; // 15% buffer for breaks, inefficiencies etc.

export const calculateWorkforce = (data: WarehouseData): CalculationResult => {
  const {
    deliveries,
    timePerDelivery,
    orders,
    itemsPerOrder,
    timePerItemPick,
    timePerOrderPack,
    workHours,
  } = data;

  if (workHours <= 0) {
    return { receivers: 0, pickers: 0, packers: 0, total: 0, buffer: 0 };
  }

  const dailyWorkMinutes = workHours * 60;

  const totalReceivingMinutes = deliveries * timePerDelivery;
  const rawReceivers = totalReceivingMinutes / dailyWorkMinutes;

  const totalPickingMinutes = orders * itemsPerOrder * timePerItemPick;
  const rawPickers = totalPickingMinutes / dailyWorkMinutes;

  const totalPackingMinutes = orders * timePerOrderPack;
  const rawPackers = totalPackingMinutes / dailyWorkMinutes;

  const totalRawWorkers = rawReceivers + rawPickers + rawPackers;
  const bufferWorkers = totalRawWorkers * WORKER_EFFICIENCY_BUFFER;

  const calculatedReceivers = Math.ceil(rawReceivers + (bufferWorkers * (rawReceivers / totalRawWorkers || 0)));
  const calculatedPickers = Math.ceil(rawPickers + (bufferWorkers * (rawPickers / totalRawWorkers || 0)));
  const calculatedPackers = Math.ceil(rawPackers + (bufferWorkers * (rawPackers / totalRawWorkers || 0)));
  
  const totalWithBuffer = calculatedReceivers + calculatedPickers + calculatedPackers;

  return {
    receivers: isNaN(calculatedReceivers) ? 0 : calculatedReceivers,
    pickers: isNaN(calculatedPickers) ? 0 : calculatedPickers,
    packers: isNaN(calculatedPackers) ? 0 : calculatedPackers,
    total: isNaN(totalWithBuffer) ? 0 : totalWithBuffer,
    buffer: Math.round(bufferWorkers)
  };
};
