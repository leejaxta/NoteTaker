export const categoryExists = (categories, name) => {
  return categories.some(
    c => c.name.toLowerCase() === name.toLowerCase()
  );
};
