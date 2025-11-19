import { GoogleGenAI, Type } from "@google/genai";
import { WarehouseData, CalculationResult } from "../types";

// Initialize Gemini
// NOTE: In a real production build, ensure process.env.API_KEY is set in vite.config.ts define or .env
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseWarehouseText = async (text: string): Promise<Partial<WarehouseData>> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Extract logistic warehouse data from the following text. 
      If a value is not mentioned, do not include it in the JSON.
      Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            deliveries: { type: Type.NUMBER, description: "Number of deliveries/trucks" },
            itemsPerDelivery: { type: Type.NUMBER, description: "Average items or pallets per delivery" },
            orders: { type: Type.NUMBER, description: "Number of orders to process" },
            itemsPerOrder: { type: Type.NUMBER, description: "Average items per order/lines" },
            currentEmployees: { type: Type.NUMBER, description: "Current staff count" },
            workHours: { type: Type.NUMBER, description: "Shift duration in hours" }
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    return {};
  } catch (error) {
    console.error("AI Parsing Error:", error);
    throw new Error("Nie udało się przetworzyć tekstu przez AI.");
  }
};

export const generateOperationalInsights = async (data: WarehouseData, result: CalculationResult): Promise<string> => {
    try {
        const prompt = `
        Act as a Senior Logistics Manager. Analyze the following warehouse staffing calculation.
        
        Input Data:
        - Deliveries: ${data.deliveries} (Avg ${data.itemsPerDelivery} items/delivery)
        - Receiving KPI: ${data.deliveriesPerHour} trucks/h/person
        - Orders: ${data.orders} (Avg ${data.itemsPerOrder} items/order)
        - Picking KPI: ${data.itemsPickedPerHour} items/h/person
        - Packing KPI: ${data.ordersPackedPerHour} orders/h/person
        - Shift: ${data.workHours}h, Breaks: ${data.breakTime}min, Efficiency: ${data.processEfficiency}%
        - Current Staff: ${data.currentEmployees}

        Calculated Needs (FTE):
        - Receiving: ${result.receivers}
        - Picking: ${result.pickers}
        - Packing: ${result.packers}
        - TOTAL NEEDED: ${result.total}
        - GAP: ${result.needed > 0 ? 'Shortage of ' + result.needed : 'Surplus available'}

        Task:
        Provide a short, tactical advice summary (max 3 bullet points) in Polish language using Markdown.
        Focus on:
        1. Where is the bottleneck?
        2. Is the efficiency settings (85%) realistic or should be improved?
        3. Suggest an operational move (e.g., move people from packing to picking).
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Flash is good enough for text generation here
            contents: prompt,
        });

        return response.text || "Brak analizy.";

    } catch (error) {
        console.error("AI Analysis Error:", error);
        return "Nie udało się wygenerować analizy operacyjnej.";
    }
}