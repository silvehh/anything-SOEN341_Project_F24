//avg test file
import { assert } from 'chai';
import { avg } from './avg.test.mjs'; 
describe('avg', function() { 
  it('should give average of the rating of 10', function() {
    const result = avg([10, 10, 10, 10 , 10]); 
    assert.equal(result, '10.00'); // Expected format if toFixed(2) is used
  });
});