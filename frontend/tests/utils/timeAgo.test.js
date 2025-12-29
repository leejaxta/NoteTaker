import { timeAgo } from "../../src/utils/timeAgo.js";

describe("timeAgo", () => {
  const now = new Date();

  test("returns seconds ago for times less than 60s", () => {
    const past = new Date(now.getTime() - 30 * 1000); 
    expect(timeAgo(past.toISOString())).toBe("30s ago");
  });

  test("returns minutes ago for times less than 60 minutes", () => {
    const past = new Date(now.getTime() - 5 * 60 * 1000); 
    expect(timeAgo(past.toISOString())).toBe("5m ago");
  });

  test("returns hours ago for times less than 24 hours", () => {
    const past = new Date(now.getTime() - 3 * 60 * 60 * 1000); 
    expect(timeAgo(past.toISOString())).toBe("3h ago");
  });

  test("returns days ago for times less than 7 days", () => {
    const past = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); 
    expect(timeAgo(past.toISOString())).toBe("2d ago");
  });

  test("returns weeks ago for times less than 4 weeks", () => {
    const past = new Date(now.getTime() - 3 * 7 * 24 * 60 * 60 * 1000); 
    expect(timeAgo(past.toISOString())).toBe("3w ago");
  });

  test("returns months ago for times less than 12 months", () => {
    const past = new Date(now.getTime() - 5 * 30 * 24 * 60 * 60 * 1000); 
    expect(timeAgo(past.toISOString())).toBe("5m ago");
  });

  test("returns years ago for times greater than or equal to 12 months", () => {
    const past = new Date(now.getTime() - 3 * 365 * 24 * 60 * 60 * 1000); 
    expect(timeAgo(past.toISOString())).toBe("3y ago");
  });
});
