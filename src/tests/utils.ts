export function isTestingLocalhost() {
  const url = new URL(process.env.DATABASE_URL || "");
  if (
    !url.hostname.includes("localhost") &&
    !url.hostname.includes("127.0.0.1") &&
    !url.hostname.includes("postgresql")
  ) {
    console.log("Tests must be run on local db");
    process.exit(1);
  }
}

export const waitUntil = async (targetTime: number) => {
  const now = Date.now();
  const remainingTime = targetTime - now;
  if (remainingTime > 0) {
    await new Promise((r) => setTimeout(r, remainingTime));
  }
};
