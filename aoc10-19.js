const input = `.###..#######..####..##...#
########.#.###...###.#....#
###..#...#######...#..####.
.##.#.....#....##.#.#.....#
###.#######.###..##......#.
#..###..###.##.#.#####....#
#.##..###....#####...##.##.
####.##..#...#####.#..###.#
#..#....####.####.###.#.###
#..#..#....###...#####..#..
##...####.######....#.####.
####.##...###.####..##....#
#.#..#.###.#.##.####..#...#
..##..##....#.#..##..#.#..#
##.##.#..######.#..#..####.
#.....#####.##........#####
###.#.#######..#.#.##..#..#
###...#..#.#..##.##..#####.
.##.#..#...#####.###.##.##.
...#.#.######.#####.#.####.
#..##..###...###.#.#..#.#.#
.#..#.#......#.###...###..#
#.##.#.#..#.#......#..#..##
.##.##.##.#...##.##.##.#..#
#.###.#.#...##..#####.###.#
#.####.#..#.#.##.######.#..
.#.#####.##...#...#.##...#.`;

const test = `.#..#
.....
#####
....#
...##`;

const test2 = `......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`;

const mapToGrid = map => map.split(/[\r\n]+/).map(row => row.split("").map(field => field === '#'));

const divisors = x => {
    const result = [];
    for (let i = 2; i < Math.sqrt(x); i++) {
        if (x % i === 0) result.push(i);
    }

    return result;
}

//Runs a beam from x/y in the direction of offX and offY
const beam = (x, y, offX, offY, grid) => {
    if (Math.abs(offX) === 0 && Math.abs(offY) === 0) return false; //0 offsets make no sense. We don't track our own asteroid so false.
    
    const inX = x;
    const inY = y;

    const onePair = Math.abs(offX) === 1 && Math.abs(offY) === 1; // If both are 1 or -1, they are allowed to be equal; this has to be an extra check
    const oneInvolved = Math.abs(offX) === 1 || Math.abs(offY) === 1; // If there is a one involved (and some other number) the offsets are divisible but that should be ignored in this case
    
    const divOffX = divisors(offX);
    const divOffY = divisors(offY);
    const commonDivisor = divOffX.some(nr => divOffY.indexOf(nr) > -1);
    const notDivisible = oneInvolved || !commonDivisor; //If they share a common divisor, the path they trace was already traced by smaller offsets before (I think) so we can ignore this.
    const notEqual = offX !== offY;

    /* 
     * So to sum up: We trace if
     * The values are both 1 or -1 OR
     * They do NOT share a common divisor AND are NOT equal
     */
    if (onePair || (notDivisible && notEqual)) {
        //While we are within the bounds of the map
        while ((x >= 0 && x < grid.length) && (y >= 0 && y < grid[x].length)) {
            //Increase the checked coordinates by the given offsets
            x += offX;
            y += offY;

            //If there is an asteroid
            if (grid[x] && grid[x][y]) {
                if (inX === 2 && inY === 5) //This was just for debugging and can be ignored mostly. I think x and y are flipped, sorry.
                    console.log(`Found 'roid at ${x}:${y}! Started from ${inX}:${inY} with offsets ${offX}:${offY}`);
                //Return true
                return true;
            }
        }
    }
    return false;
}

// Counts how many beams hit something from asteroid x/y
const beamCount = (x, y, grid) => {
    //Create offset arrays by taking the indices of empty arrays of the required size, mapping to pairs of positive and negative values and flatting the resulting array.
    //I know there are duplicates because of 0 and -0 but that's ok :') I think so at least.
    const xOffsets = [...Array(grid.length).keys()].map(x => [x, -x]).flat();
    const yOffsets = [...Array(grid[0].length).keys()].map(y => [y, -y]).flat();
    const hits = new Set();

    //For all offset combinations
    for (let i = 0; i < xOffsets.length; i++) {
        for (let j = 0; j < yOffsets.length; j++) {
            //Run a beam and see if it hit something
            if (beam(x, y, xOffsets[i], yOffsets[j], grid)) {
                // If it did, add the coordinates as string to the prepared set.
                hits.add(`${x+xOffsets[i]},${y+yOffsets[j]}`);
            }
        }
    }

    return hits.size;
}

const part1 = x => {
    //Create a boolean grid from the input
    const grid = mapToGrid(x);

    //Define a default result set
    let cMax = {max: 0, x: 0, y: 0};

    //For all coordinates
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            //Check if there is an asteroid there to build a base on.
            if (grid[i][j]) {
                //Get the count of beams that found another asteroid
                const cCount = beamCount(i, j, grid);
                if (i === 8 && j === 5) console.log(cCount); //Debug, can be ignored

                // If the count is greater than the currently recorded max, update the result set.
                if (cCount > cMax.max) cMax = {max: cCount, x: i, y: j};
            }
        }
    }

    //Return it.
    return cMax;
}

console.log(part1(test2));
