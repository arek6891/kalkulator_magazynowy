
export interface WarehouseData {
  id?: string; // Unique identifier for history
  date?: string; // Date of the calculation
  deliveries: number;
  itemsPerDelivery: number;
  deliveriesPerHour: number;
  orders: number;
  itemsPerOrder: number;
  itemsPickedPerHour: number;
  ordersPackedPerHour: number;
  workHours: number;
  currentEmployees: number;
  // New logistic parameters
  breakTime: number; // in minutes
  processEfficiency: number; // in percentage (0-100)
}

export interface CalculationResult {
  receivers: number;
  pickers: number;
  packers: number;
  total: number;
  buffer: number;
  needed: number;
  effectiveWorkHours: number; // For display purposes
}

export interface HistoryRecord {
  id: string;
  timestamp: number;
  data: WarehouseData;
  result: CalculationResult;
}
