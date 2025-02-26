const limit = 10;

const func = (n, ketqua, name_func) => {
    return `
        **** ${name_func}
        - Số đã nhập: ${n}
        - Kết quả nhập: ${ketqua}
        - Điều kiện phải nhỏ hơn: ${limit}
    `
}

var sum_to_n_a = function (n) {
    let sumA = 0;
    for (let i = 1; i <= n; i++) {
        sumA += i;
        if (sumA + (i + 1) >= limit) {
            break;
        }
    }

    return func(n, sumA, "sum_to_n_a");
};

var sum_to_n_b = function (n) {
    let a = 1, b = 1, c = -2 * limit;
    let delta = b * b - 4 * a * c;
    let d = Math.floor((-b + Math.sqrt(delta)) / (2 * a));
    d = Math.min(d, n);
    let sumB = (d * (d + 1)) / 2;
    let result = sumB >= limit ? ((d - 1) * d) / 2 : sumB;
    return func(n, result, "sum_to_n_b");
};

var sum_to_n_c = function (n) {
    if (n == 1) return 1;
    let sumC = sum_to_n_c(n - 1, limit);
    return (sumC + n < limit) ? sumC + n : sumC;
};

const nS = 50;

console.log(sum_to_n_a(nS))
console.log(sum_to_n_b(nS))
console.log(`
        **** sum_to_n_c
        - Số đã nhập: ${nS}
        - Kết quả nhập: ${sum_to_n_c(nS)}
        - Điều kiện phải nhỏ hơn: ${limit}
    `)
console.log(Number.MAX_SAFE_INTEGER);