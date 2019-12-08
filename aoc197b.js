const input = `3,8,1001,8,10,8,105,1,0,0,21,42,67,88,105,114,195,276,357,438,99999,3,9,101,4,9,9,102,3,9,9,1001,9,2,9,102,4,9,9,4,9,99,3,9,1001,9,4,9,102,4,9,9,101,2,9,9,1002,9,5,9,1001,9,2,9,4,9,99,3,9,1001,9,4,9,1002,9,4,9,101,2,9,9,1002,9,2,9,4,9,99,3,9,101,4,9,9,102,3,9,9,1001,9,5,9,4,9,99,3,9,102,5,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,99`;
const test = `3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10`;

const getWithMode = (values, value, mode) => mode === 1 ? value : values[value];

const outputFunction2 = (ampOutput) => ({amp, end}) => {
    console.log(amp);
    ampOutput.push(amp);
}

const compuper = (values, index, ampNr, inputBuffer, outputFunction) => {
    while (true) {
        const instruction = values[index].toString().padStart(4, '0');
        const split = /(\d)(\d)(\d\d)/.exec(instruction).map(Number);
        const opCode = split[3];

        if (opCode === 99) {
            if (ampNr === 4)
                console.log("YEEEEEEET");
            else {
                const nextAmp = amps[(ampNr + 1) % 5];
                compuper(nextAmp.values, nextAmp.index, nextAmp.ampNr, nextAmp.input, nextAmp.outputFunction);
            }

            break;
        }

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

                if (inputBuffer.length === 0) {
                    amps[ampNr] = {
                        values,
                        index,
                        ampNr,
                        input: inputBuffer,
                        outputFunction,
                    };

                    const nextAmp = amps[(ampNr + 1) % 5];
                    return compuper(nextAmp.values, nextAmp.index, nextAmp.ampNr, nextAmp.input, nextAmp.outputFunction);
                }
                
                const writtenValue = inputBuffer[0];
                inputBuffer.splice(0, 1);

                values[target] = writtenValue;
                index += 2;
                break;
            }
            case 4: {
                const target = getWithMode(values, values[index + 1], split[2]);
                outputFunction({amp: target, end: false});
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

const amps = [];

const part2 = x => {
    const getValues = () => x.split(',').map(Number);
    const ampInputs = [
        [9, 0],
        [7],
        [8],
        [5],
        [6],
    ];
    
    for (let i = 0; i < 5; i++) {
        amps.push({
            values: getValues(),
            index: 0,
            ampNr: i,
            input: ampInputs[i],
            outputFunction: outputFunction2(ampInputs[(i+1) % ampInputs.length]),
        });
    }

    const start = amps[0];

    compuper(start.values, start.index, start.ampNr, start.input, start.outputFunction);
};

console.log(part2(test));
