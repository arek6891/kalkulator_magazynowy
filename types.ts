
export interface WarehouseData {
  deliveries: number;
  itemsPerDelivery: number;
  timePerDelivery: number; // in minutes
  orders: number;
  itemsPerOrder: number;
  timePerItemPick: number; // in minutes
  timePerOrderPack: number; // in minutes
  workHours: number;
}

export interface CalculationResult {
  receivers: number;
  pickers: number;
  packers: number;
  total: number;
  buffer: number;
}
