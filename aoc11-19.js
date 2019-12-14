const input = `3,8,1005,8,318,1106,0,11,0,0,0,104,1,104,0,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,0,10,4,10,102,1,8,29,1006,0,99,1006,0,81,1006,0,29,3,8,102,-1,8,10,1001,10,1,10,4,10,108,1,8,10,4,10,1001,8,0,59,3,8,102,-1,8,10,101,1,10,10,4,10,1008,8,1,10,4,10,102,1,8,82,1,1103,3,10,2,104,14,10,3,8,102,-1,8,10,101,1,10,10,4,10,108,1,8,10,4,10,102,1,8,111,1,108,2,10,2,1101,7,10,1,1,8,10,1,1009,5,10,3,8,1002,8,-1,10,101,1,10,10,4,10,108,0,8,10,4,10,102,1,8,149,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,1,10,4,10,101,0,8,172,3,8,1002,8,-1,10,1001,10,1,10,4,10,108,0,8,10,4,10,1001,8,0,193,1006,0,39,2,103,4,10,2,1103,20,10,3,8,1002,8,-1,10,1001,10,1,10,4,10,1008,8,0,10,4,10,102,1,8,227,1,1106,8,10,2,109,15,10,2,106,14,10,3,8,102,-1,8,10,101,1,10,10,4,10,1008,8,1,10,4,10,101,0,8,261,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,0,10,4,10,102,1,8,283,1,1109,9,10,2,1109,5,10,2,1,2,10,1006,0,79,101,1,9,9,1007,9,1087,10,1005,10,15,99,109,640,104,0,104,1,21101,936333124392,0,1,21101,0,335,0,1106,0,439,21102,1,824663880596,1,21102,346,1,0,1105,1,439,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,21102,1,179519553539,1,21101,393,0,0,1106,0,439,21102,46266515623,1,1,21101,0,404,0,1106,0,439,3,10,104,0,104,0,3,10,104,0,104,0,21101,0,983925826324,1,21101,0,427,0,1106,0,439,21101,988220642048,0,1,21102,1,438,0,1105,1,439,99,109,2,21201,-1,0,1,21102,1,40,2,21101,0,470,3,21101,460,0,0,1106,0,503,109,-2,2105,1,0,0,1,0,0,1,109,2,3,10,204,-1,1001,465,466,481,4,0,1001,465,1,465,108,4,465,10,1006,10,497,1101,0,0,465,109,-2,2106,0,0,0,109,4,2102,1,-1,502,1207,-3,0,10,1006,10,520,21101,0,0,-3,22102,1,-3,1,21202,-2,1,2,21102,1,1,3,21102,1,539,0,1105,1,544,109,-4,2106,0,0,109,5,1207,-3,1,10,1006,10,567,2207,-4,-2,10,1006,10,567,21202,-4,1,-4,1106,0,635,21202,-4,1,1,21201,-3,-1,2,21202,-2,2,3,21102,1,586,0,1105,1,544,21202,1,1,-4,21102,1,1,-1,2207,-4,-2,10,1006,10,605,21101,0,0,-1,22202,-2,-1,-2,2107,0,-3,10,1006,10,627,21202,-1,1,1,21102,1,627,0,105,1,502,21202,-2,-1,-2,22201,-4,-2,-4,109,-5,2106,0,0`;

const getWithMode = (values, value, mode, relativeBase) => {
    switch (mode) {
        case 0: return values[value];
        case 1: return value;
        case 2: return values[value + relativeBase];
        default: return console.log("WHAT THE FUCK?!");
    }
}

const getTargetWithMode = (values, index, mode, relativeBase) => {
    switch (mode) {
        case 0: return values[index];
        case 1: throw "WHY WAS I CREATED THIS WAY?!";
        case 2: return values[index] + relativeBase;
        default: return console.log("WHAT IN THE ABSOLUTE FUCK, WHAT?!?!");
    }
}

const compuper = (input, inputBuffer, outputFunction) => {
    const values = input.split(",").map(Number);
    let index = 0;
    let relativeBase = 0;
    let firstOutput = true;

    while (true) {
        const instruction = values[index].toString().padStart(5, '0');
        const split = /(\d)(\d)(\d)(\d\d)/.exec(instruction).map(Number);
        const opCode = split[4];

        if (opCode === 99) break;

        switch (opCode) {
            case 1: {
                const a = getWithMode(values, values[index + 1], split[3], relativeBase);
                const b = getWithMode(values, values[index + 2], split[2], relativeBase);
                const target = getTargetWithMode(values, index + 3, split[1], relativeBase);
                values[target] = a + b;
                index += 4;
                break;
            }
            case 2: {
                const a = getWithMode(values, values[index + 1], split[3], relativeBase);
                const b = getWithMode(values, values[index + 2], split[2], relativeBase);
                const target = getTargetWithMode(values, index + 3, split[1], relativeBase);
                values[target] = a * b;
                index += 4;
                break;
            }
            case 3: {
                const writtenValue = inputBuffer[0];
                inputBuffer.splice(0, 1);

                const target = getTargetWithMode(values, index + 3, split[1], relativeBase);
                values[target] = writtenValue;
                index += 2;
                break;
            }
            case 4: {
                const target = getWithMode(values, values[index + 1], split[3], relativeBase);
                outputFunction(target, firstOutput);
                firstOutput = !firstOutput;
                index += 2;
                break;
            }
            case 5: {
                const a = getWithMode(values, values[index + 1], split[3], relativeBase);
                if (a) {
                    index = getWithMode(values, values[index + 2], split[2], relativeBase);
                } else index += 3;
                break;
            }
            case 6: {
                const a = getWithMode(values, values[index + 1], split[3], relativeBase);
                if (!a) index = getWithMode(values, values[index + 2], split[2], relativeBase);
                else index += 3;
                break;
            }
            case 7: {
                const a = getWithMode(values, values[index + 1], split[3], relativeBase);
                const b = getWithMode(values, values[index + 2], split[2], relativeBase);
                const target = getTargetWithMode(values, index + 3, split[1], relativeBase);
                if (a < b) values[target] = 1;
                else values[target] = 0;
                index += 4;
                break;
            }
            case 8: {
                const a = getWithMode(values, values[index + 1], split[3], relativeBase);
                const b = getWithMode(values, values[index + 2], split[2], relativeBase);
                const target = getTargetWithMode(values, index + 3, split[1], relativeBase);
                if (a === b) values[target] = 1;
                else values[target] = 0;
                index += 4;
                break;
            }
            case 9: {
                const a = getWithMode(values, values[index + 1], split[3], relativeBase);
                relativeBase += a;
                index += 2;
                break;
            }
        }
    }
}

const newDir = (dir, instr) => {
    if (instr !== 0 && instr !== 1) console.log("HOL UP JUST ONE SECOND!");

    const directions = ['u', 'r', 'd', 'l'];
    
    if (instr === 0) instr = -1;
    
    const c = directions.indexOf(dir);
    let newD = c + instr;
    if (newD >= directions.length) newD = newD % directions.length;
    if (newD < 0) newD += directions.length;
    return directions[newD];
}

const newCoords = ({ x, y }, dir) => {
    switch (dir) {
        case 'u': return { x, y: y - 1 };
        case 'd': return { x, y: y + 1 };
        case 'l': return { x: x - 1, y };
        case 'r': return { x: x + 1, y };
        default: console.log("WHAT THE FUCK?!", dir);
    }
}

let log = true;

// Takes the panel to paint on, the bot-state object and the inputBuffer of the bot to create a new function
// That new function takes the actual output value, and a flag indicating whether it is the first of two outputs or not.
const outputFunctionGen = (panel, bot, inputBuffer) => (value, first) => {
    //Get the current x and y coords of the bot
    const { coords: { x, y } } = bot;
    
    // If this output is currently the first in the set of two (i.e. the value to write)
    if (first) {
        // Check if the object with the spot to draw to already exists
        if (!panel[x]) panel[x] = {}; // if not, create it
        // And write the passed value to it.
        panel[x][y] = value;

        // Add the coordinate pair to the set.
        const coord = `${x},${y}`;
        bot.painted.add(coord);
    } else {

    // If this output is currently the second in the set of two (i.e. the turn instruction)

        // Get the new direction based on the passed value and the current direction
        bot.dir = newDir(bot.dir, value);

        // Get the new coordinates based on the new direction and the current coordinates.
        bot.coords = newCoords(bot.coords, bot.dir);

        // If the panel section to read from does not exist yet
        if (!panel[bot.coords.x]) panel[bot.coords.x] = {}; // Create it

        // Determine the value of the panel the bot is over now 
        const paintValue = +!!panel[bot.coords.x][bot.coords.y]

        // And pass it to the input of the bot
        inputBuffer.push(paintValue);
    }
}

const part1 = x => {
    // Create an empty panel
    const panel = {};

    let coords = { x: 0, y: 0 }; // Default coordinates

    // Creates a new bot object that holds the direction, the coordinates as well as a Set of the painted coordinates as result.
    // Default direction is up (not that it matters, really).
    const bot = { dir: 'u', coords, painted: new Set()};

    // Create the inputBuffer. All tiles are black so 0.
    const inputBuffer = [0];

    // Run the computer with the input, the created inputBuffer and the outputFunction with the panel, the bot-state and the input
    compuper(x, inputBuffer, outputFunctionGen(panel, bot, inputBuffer));

    // Return the count of the painted tiles.
    return bot.painted.size;
}

console.log(part1(input));
