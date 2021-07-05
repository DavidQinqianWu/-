var origin = {
  a: 1,
  b: [2, 3, 4],
  c: {
    d: 'name',
  },
};

var result = Object.assign({}, origin);
console.log(origin);
console.log(result);

result.c.d = 'city';
console.log(origin);
console.log(result);
