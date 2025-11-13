
export interface WarehouseData {
  deliveries: number;
  itemsPerDelivery: number;
  deliveriesPerHour: number;
  orders: number;
  itemsPerOrder: number;
  itemsPickedPerHour: number;
  ordersPackedPerHour: number;
  workHours: number;
  currentEmployees: number;
}

export interface CalculationResult {
  receivers: number;
  pickers: number;
  packers: number;
  total: number;
  buffer: number;
  needed: number;
}