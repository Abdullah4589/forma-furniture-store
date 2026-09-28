import test from 'node:test';
import assert from 'node:assert/strict';
import { validComparison } from '../lib/catalog.ts';

test('comparison selections contain at most three unique catalog products', () => {
    assert.deepEqual(validComparison(['arc', 'arc', 'not-a-product', 'form', 'halo', 'still']), ['arc', 'form', 'halo']);
    assert.deepEqual(validComparison([null, 4, 'pebble']), ['pebble']);
    assert.deepEqual(validComparison({ ids: ['arc'] }), []);
});
