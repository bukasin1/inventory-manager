export const waitUntil = async (targetTime: number) => {
  const now = Date.now();
  const remainingTime = targetTime - now;
  if (remainingTime > 0) {
    await new Promise((r) => setTimeout(r, remainingTime));
  }
};
