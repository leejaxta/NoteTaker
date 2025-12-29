import { categoryExists } from "../../src/utils/category.js";

describe("categoryExists", () => {
  const categories = [
    { name: "Work" },
    { name: "Personal" },
    { name: "Shopping" },
  ];

  test("returns true if category exists (case insensitive)", () => {
    expect(categoryExists(categories, "work")).toBe(true);
    expect(categoryExists(categories, "WORK")).toBe(true);
    expect(categoryExists(categories, "Shopping")).toBe(true);
  });

  test("returns false if category does not exist", () => {
    expect(categoryExists(categories, "Health")).toBe(false);
    expect(categoryExists(categories, "Fitness")).toBe(false);
  });

  test("works with empty category list", () => {
    expect(categoryExists([], "Work")).toBe(false);
  });

  test("works with name containing spaces", () => {
    const cats = [{ name: "Home Tasks" }];
    expect(categoryExists(cats, "home tasks")).toBe(true);
    expect(categoryExists(cats, "Home Tasks")).toBe(true);
  });
});
