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

const test3 = `.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`;

const mapToGrid = map => map.split(/[\r\n]+/).map(row => row.split("").map(field => field === '#'));

const divisors = x => {
    const result = [];
    for (let i = 2; i <= Math.ceil(x / 2); i++) {
        if (x % i === 0) result.push(i);
    }
    result.push(x);
    return result;
}

//Runs a beam from x/y in the direction of offX and offY
const beam = (x, y, offX, offY, grid) => {
    if (Math.abs(offX) === 0 && Math.abs(offY) === 0) return {hit: false}; //0 offsets make no sense. We don't track our own asteroid so false.
    
    const onePair = Math.abs(offX) === 1 && Math.abs(offY) === 1; // If both are 1 or -1, they are allowed to be equal; this has to be an extra check
    const oneInvolved = Math.abs(offX) === 1 || Math.abs(offY) === 1; // If there is a one involved (and some other number) the offsets are divisible but that should be ignored in this case
    const zeroInvolved = offX === 0 || offY === 0;

    if (zeroInvolved && !oneInvolved) return {hit: false};

    const divOffX = divisors(Math.abs(offX));
    const divOffY = divisors(Math.abs(offY));
    const commonDivisor = divOffX.some(nr => divOffY.indexOf(nr) > -1);
    const notDivisible = oneInvolved || !commonDivisor; //If they share a common divisor, the path they trace was already traced by smaller offsets before (I think) so we can ignore this.
    const notEqual = Math.abs(offX) !== Math.abs(offY);

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
                //Return true
                return {hit: true, x, y};
            }
        }
    }
    return {hit: false};
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
            if (beam(x, y, xOffsets[i], yOffsets[j], grid).hit) {
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
                // If the count is greater than the currently recorded max, update the result set.
                if (cCount > cMax.max) cMax = {max: cCount, x: i, y: j};
            }
        }
    }

    //Return it.
    return cMax;
}

const getBeamOffsets = (grid, xMlt, yMlt) => {
    let xOffsets = [...Array(grid.length).keys()].map(x => x * xMlt);
    let yOffsets = [...Array(grid[0].length).keys()].map(y => y * yMlt);
    const oneNegative = Math.sign(xMlt * yMlt) === -1;

/*    const sorter = oneNegative
        ? ([topA, botA], [topB, botB]) => topA/botA - topB/botB
        : ([topA, botA], [topB, botB]) => topB/botB - topA/botA;
  */
 const sorter = ([topA, botA], [topB, botB]) => topA/botA - topB/botB; 


    if (oneNegative) {
        xOffsets = xOffsets.filter(x => x);
    } else {
        yOffsets = yOffsets.filter(y => y);
    }

    return xOffsets.flatMap(d => yOffsets.map(v => [d, v])).sort(sorter);
}

const part2 = (input, x, y) => {
    const grid = mapToGrid(input);
    let lazored = 0;

    const firstQ = getBeamOffsets(grid, -1, 1);
    const secondQ = getBeamOffsets(grid, 1, 1);
    const thirdQ = getBeamOffsets(grid, 1, -1);
    const fourthQ = getBeamOffsets(grid, -1, -1);

    const beamOffsets = [...firstQ, ...secondQ, ...thirdQ, ...fourthQ];

    let offIndex = 0;

    while (true) {
        const offsets = beamOffsets[offIndex];
        const fireResult = beam(x, y, offsets[0], offsets[1], grid);
        if (fireResult.hit) {
            grid[fireResult.x][fireResult.y] = false;
            lazored++;

        }

        if (lazored === 200) return fireResult.y * 100 + fireResult.x;

        offIndex = (offIndex + 1) % beamOffsets.length;
    }
}

console.log(part1(input));
console.log(part2(input, 23, 17));
