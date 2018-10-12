export default (array) => {
  for (let i = array.length - 1; i; i--) {
    const rnd = Math.random() * i | 0;
    const temp = array[i];

    array[i] = array[rnd];
    array[rnd] = temp;
  }

  return array;
};
