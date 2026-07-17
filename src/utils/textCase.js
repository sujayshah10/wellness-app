export function titleCase(value) {
  return String(value || "").replace(/[A-Za-z]+/g, (word) => {
    if (word.length > 1 && word === word.toUpperCase()) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}
