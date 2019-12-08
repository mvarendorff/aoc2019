const input = ``;

const test = `3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0`;

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

const outputFunction = (input, ampNr) => amp => {
    if (ampNr === 4) return outValues.push(amp);

    for (let i = 0; i < 5; i++) {
        compuper(input, generator(i, amp), outputFunction(input, ampNr + 1));
    }
};

const top3 = x => {
    const result = [];
    for (let i = 0; i < 3; i++) {
        const max = Math.max(...x);
        const maxIndex = x.indexOf(max);
        x.splice(maxIndex, 1);
        result.push(max);
    }

    return result;
}

const part1 = x => {
    for (let i = 0; i < 5; i++) {
        compuper(x, generator(i, 0), outputFunction(x, 0));
    }

    return outValues;
}

const outValues = [];

console.log(part1(test));
