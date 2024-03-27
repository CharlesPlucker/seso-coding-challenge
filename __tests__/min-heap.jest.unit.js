const MinHeap = require("../lib/min-heap");

describe('MinHeap', () => {
    describe('Supports Adding Items', () => {
        test('should keep track of the min for nomal cases and default valueKey', () => {
            const testMinHeap = new MinHeap();
            testMinHeap.add({'value': 10});
            expect(testMinHeap.peek().value).toBe(10);

            testMinHeap.add({'value': 11});
            expect(testMinHeap.peek().value).toBe(10);

            testMinHeap.add({'value': 7});
            expect(testMinHeap.peek().value).toBe(7);

            testMinHeap.add({'value': 10});
            expect(testMinHeap.peek().value).toBe(7);

            testMinHeap.add({'value': -3});
            expect(testMinHeap.peek().value).toBe(-3);
        });

        test('should throw error if adding item without a comparator value', () => {
            const testMinHeap = new MinHeap();
            const throwsExample = () => {
                testMinHeap.add(5);
            }
            expect(throwsExample).toThrow('Error: MinHeap only supports objects with a comparator key.')
        });
    });

    describe('Supports Removing Items', () => {
        test('should return false if there are no more items', () => {
            const testMinHeap = new MinHeap();
            testMinHeap.add({'value': 10});
            testMinHeap.add({'value': 3});
            expect(testMinHeap.remove()).toBeTruthy();
            expect(testMinHeap.remove()).toBeTruthy();
            expect(testMinHeap.remove()).toBe(false);
        });

        test('should keep track of the min for normal cases', () => {
            const testMinHeap = new MinHeap();
            testMinHeap.add({'value': 10});
            testMinHeap.add({'value': 3});
            testMinHeap.add({'value': -2});
            testMinHeap.add({'value': 11});
            testMinHeap.add({'value': 15});

            expect(testMinHeap.peek().value).toBe(-2);
            expect(testMinHeap.remove().value).toBe(-2);
            expect(testMinHeap.remove().value).toBe(3);
            expect(testMinHeap.remove().value).toBe(10);
            expect(testMinHeap.remove().value).toBe(11);
            expect(testMinHeap.remove().value).toBe(15);
        });
    });

    describe('Supports Custom Comparator Key', () => {
        test('should keep track of the min for nomal cases and custom valueKey', () => {
            const testMinHeap = new MinHeap('timestamp');
            testMinHeap.add({'timestamp': 10});
            expect(testMinHeap.peek().timestamp).toBe(10);

            testMinHeap.add({'timestamp': 11});
            expect(testMinHeap.peek().timestamp).toBe(10);

            testMinHeap.add({'timestamp': 7});
            expect(testMinHeap.peek().timestamp).toBe(7);

            testMinHeap.add({'timestamp': 10});
            expect(testMinHeap.peek().timestamp).toBe(7);

            testMinHeap.add({'timestamp': 3});
            expect(testMinHeap.peek().timestamp).toBe(3);

            expect(testMinHeap.remove().timestamp).toBe(3);

            expect(testMinHeap.peek().value).toBe(undefined);
        });
    });
});