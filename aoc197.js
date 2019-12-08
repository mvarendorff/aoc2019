const input = `3,8,1001,8,10,8,105,1,0,0,21,42,67,88,105,114,195,276,357,438,99999,3,9,101,4,9,9,102,3,9,9,1001,9,2,9,102,4,9,9,4,9,99,3,9,1001,9,4,9,102,4,9,9,101,2,9,9,1002,9,5,9,1001,9,2,9,4,9,99,3,9,1001,9,4,9,1002,9,4,9,101,2,9,9,1002,9,2,9,4,9,99,3,9,101,4,9,9,102,3,9,9,1001,9,5,9,4,9,99,3,9,102,5,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,99`;
const test = `3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0`;

const getWithMode = (values, value, mode) => mode === 1 ? value : values[value];

const compuper = (input, inputGenerator, outputFunction) => {
    const values = input.split(",").map(Number);
    let index = 0;

    while (true) {
        const instruction = values[index].toString().padStart(4, '0');
        const split = /(\d)(\d)(\d\d)/.exec(instruction).map(Number);
        const opCode = split[3];

        if (opCode === 99) break;

        switch(opCode) {
            case 1: {
                const a = getWithMode(values, values[index + 1], split[2]);
                const b = getWithMode(values, values[index + 2], split[1]);
                const target = values[index + 3];
                values[target] = a + b;
                index += 4;
                break;
            }
            case 2: {
                const a = getWithMode(values, values[index + 1], split[2]);
                const b = getWithMode(values, values[index + 2], split[1]);
                const target = values[index + 3];
                values[target] = a * b;
                index += 4;
                break;
            }
            case 3: {
                const target = values[index + 1];
                const writtenValue = inputGenerator.next().value;
                values[target] = writtenValue;
                index += 2;
                break;
            }
            case 4: {
                const target = getWithMode(values, values[index + 1], split[2]);
                outputFunction(target);
                index += 2;
                break;
            }
            case 5: {
                const a = getWithMode(values, values[index + 1], split[2]);
                if (a) {
                    index = getWithMode(values, values[index + 2], split[1]);
                } else index += 3;
                break;
            }
            case 6: {
                const a = getWithMode(values, values[index + 1], split[2]);
                if (!a) index = getWithMode(values, values[index + 2], split[1]);
                else index += 3;
                break;
            }
            case 7: {
                const a = getWithMode(values, values[index + 1], split[2]);
                const b = getWithMode(values, values[index + 2], split[1]);
                const target = values[index + 3];
                if (a < b) values[target] = 1;
                else values[target] = 0;
                index += 4;
                break;
            }
            case 8: {
                const a = getWithMode(values, values[index + 1], split[2]);
                const b = getWithMode(values, values[index + 2], split[1]);
                const target = values[index + 3];
                if (a === b) values[target] = 1;
                else values[target] = 0;
                index += 4;
                break;
            }
        }
    }
}

const generator = function*(first, second) {
    yield first;
    yield second;
}

const getAvailableFromUsed = used => {
    const allowed = [0, 1, 2, 3, 4];
    return allowed.filter(x => !used.includes(x));
}

const outputFunction = (input, ampNr, usedSignals) => amp => {
    if (ampNr === 4) return outValues.push(amp);

    const available = getAvailableFromUsed(usedSignals);

    for (let i of available) {
        const newUsed = [...usedSignals, i];
        compuper(input, generator(i, amp), outputFunction(input, ampNr + 1, newUsed));
    }
};

const part1 = x => {
    for (let i = 0; i < 5; i++) {
        compuper(x, generator(i, 0), outputFunction(x, 0, [i]));
    }

    return Math.max(...outValues);
}

const outValues = [];

console.log(part1(input));
