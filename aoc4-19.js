const input = `347312-805915`;

const range = x => {
    const split = x.split("-").map(Number);
    return {start: split[0], end: split[1]};
};

const onlyIncrease = x => {
    const str = x.toString().split("");
    for (let i = 0; i < str.length - 1; i++) {
        if (str[i] > str[i+1]) return false;
    }

    return true;
};

const isSixDigit = x => x.toString().length === 6;

const hasPair = x => {
    const str = x.toString().split("");
    for (let i = 0; i < str.length - 1; i++) {
        if (str[i] === str[i+1]) return true;
    }

    return false;
};

const hasPair2 = x => {
    const str = x.toString().split("");
    for (let i = 0; i < str.length - 1; i++) {
        if (str[i] === str[i+1] && str[i] !== str[i+2] && str[i] !== str[i - 1]) return true;
    }

    return false;
}

const part1 = (x, hasPairFunc) => {
    const {start, end} = range(x);
    let count = 0;
    for (let i = start; i <= end; i++) {
        if (onlyIncrease(i) && isSixDigit(i) && hasPairFunc(i)) count++;
    }
    return count;
};

console.log(part1(input, hasPair));
console.log(part1(input, hasPair2));
