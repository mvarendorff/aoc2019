const input = `3,8,1001,8,10,8,105,1,0,0,21,42,67,88,105,114,195,276,357,438,99999,3,9,101,4,9,9,102,3,9,9,1001,9,2,9,102,4,9,9,4,9,99,3,9,1001,9,4,9,102,4,9,9,101,2,9,9,1002,9,5,9,1001,9,2,9,4,9,99,3,9,1001,9,4,9,1002,9,4,9,101,2,9,9,1002,9,2,9,4,9,99,3,9,101,4,9,9,102,3,9,9,1001,9,5,9,4,9,99,3,9,102,5,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,99`;
const test = `3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5`;

const getWithMode = (values, value, mode) => mode === 1 ? value : values[value];

const outputFunction2 = ampOutput => amp => {
    ampOutput.push(amp);
}

const compuper = (values, index, ampNr, inputBuffer, outputFunction) => {
    while (true) {
        const instruction = values[index].toString().padStart(4, '0');
        const split = /(\d)(\d)(\d\d)/.exec(instruction).map(Number);
        const opCode = split[3];

        if (opCode === 99) {
            if (ampNr !== 4) {
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

    const permutations = permutator([5, 6, 7, 8, 9]);
    const outputValues = [];

    for (let perm of permutations) {
        perm = perm.map(x => [x]);
        perm[0] = [...perm[0], 0];

        const ampInputs = perm;
        console.log(ampInputs);

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
    
        outputValues.push(amps[0].input[0])
        amps.length = 0;
    }

    return Math.max(...outputValues);
};

//https://stackoverflow.com/a/20871714/6707985
const permutator = (inputArr) => {
    let result = [];

    const permute = (arr, m = []) => {
        if (arr.length === 0) {
            result.push(m)
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next))
            }
        }
    }

    permute(inputArr)

    return result;
}

console.log(part2(input));
