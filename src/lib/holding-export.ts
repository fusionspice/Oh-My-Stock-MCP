import type { NormalizedHolding } from "../types.js";

export type ExportHolding = {
  brokerId: string;
  brokerName: string;
  capturedAt: string;
  accountNumber: string;
  displayAccountNumber: string;
  category: string;
  productName?: string;
  productCode?: string;
  quantity?: number;
  purchasePrice?: number;
  currentPrice?: number;
  currency?: string;
  fxRate?: number;
};

export function toExportHolding(holding: NormalizedHolding): ExportHolding {
  return {
    brokerId: holding.brokerId,
    brokerName: holding.brokerName,
    capturedAt: holding.capturedAt,
    accountNumber: holding.accountNumber,
    displayAccountNumber: holding.displayAccountNumber,
    category: holding.category,
    ...(holding.productName ? { productName: holding.productName } : {}),
    ...(holding.productCode ? { productCode: holding.productCode } : {}),
    ...(holding.quantityValue !== undefined ? { quantity: holding.quantityValue } : {}),
    ...(holding.purchasePriceValue !== undefined
      ? { purchasePrice: holding.purchasePriceValue }
      : {}),
    ...(holding.currentPriceValue !== undefined
      ? { currentPrice: holding.currentPriceValue }
      : {}),
    ...(holding.currency ? { currency: holding.currency } : {}),
    ...(holding.fxRateValue !== undefined ? { fxRate: holding.fxRateValue } : {}),
  };
}
