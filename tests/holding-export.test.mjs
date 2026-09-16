import test from 'node:test';
import assert from 'node:assert/strict';

import { toExportHolding } from '../dist/lib/holding-export.js';

test('export holding keeps only read-only portfolio fields', () => {
  const output = toExportHolding({
    brokerId: 'samsungpop',
    brokerName: 'Samsung Securities POP',
    capturedAt: '2026-09-17T10:00:00.000Z',
    accountNumber: '1234',
    displayAccountNumber: '1234',
    category: 'domestic_stock',
    productName: '삼성전자',
    productCode: '005930',
    quantityRaw: '10',
    quantityValue: 10,
    purchasePriceRaw: '65000',
    purchasePriceValue: 65000,
    currentPriceRaw: '72000',
    currentPriceValue: 72000,
    currency: 'KRW',
    raw: { password: 'must-not-export' },
  });

  assert.deepEqual(output, {
    brokerId: 'samsungpop',
    brokerName: 'Samsung Securities POP',
    capturedAt: '2026-09-17T10:00:00.000Z',
    accountNumber: '1234',
    displayAccountNumber: '1234',
    category: 'domestic_stock',
    productName: '삼성전자',
    productCode: '005930',
    quantity: 10,
    purchasePrice: 65000,
    currentPrice: 72000,
    currency: 'KRW',
  });
});
