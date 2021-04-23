export function randomizeArray<T>(arr: T[]) {
  const array = [...arr];
  for (let mutableIndex = 0; mutableIndex < array.length; ++mutableIndex) {
    const j = Math.floor(Math.random() * (mutableIndex + 1));
    [array[mutableIndex], array[j]] = [array[j], array[mutableIndex]];
  }
  return array;
}

export function capitalizeFirst<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}
