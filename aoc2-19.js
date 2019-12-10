const input = `1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,9,1,19,1,19,5,23,1,9,23,27,2,27,6,31,1,5,31,35,2,9,35,39,2,6,39,43,2,43,13,47,2,13,47,51,1,10,51,55,1,9,55,59,1,6,59,63,2,63,9,67,1,67,6,71,1,71,13,75,1,6,75,79,1,9,79,83,2,9,83,87,1,87,6,91,1,91,13,95,2,6,95,99,1,10,99,103,2,103,9,107,1,6,107,111,1,10,111,115,2,6,115,119,1,5,119,123,1,123,13,127,1,127,5,131,1,6,131,135,2,135,13,139,1,139,2,143,1,143,10,0,99,2,0,14,0`;
const test = `1,1,1,4,99,5,6,0,99`;

const opCodes = {
    1: (a, b) => a + b,
    2: (a, b) => a * b,
};

const compuper = (input, noun, verb) => {
    const numbers = input.split(",").map(Number);
    let index = 0;

    numbers[1] = noun;
    numbers[2] = verb;

    while(true) {
        const opCode = numbers[index];
        if (opCode === 99) break;

        const a = numbers[numbers[index + 1]];
        const b = numbers[numbers[index + 2]];
        const result = opCodes[opCode](a, b);
        numbers[numbers[index + 3]] = result;

        index += 4;
    }

    return numbers[0];
}

//Result 1
console.log(compuper(input, 12, 2));

const nounVerbEvaluator = (input, min, max, target) => {
    for (let noun = min; noun <= max; noun++) {
        for (let verb = min; verb <= max; verb++) {
            if (target === compuper(input, noun, verb))
                return 100 * noun + verb;
        }
    }
}

console.log(nounVerbEvaluator(input, 0, 99, 19690720));
