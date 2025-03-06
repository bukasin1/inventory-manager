import app from "./app";
import { scheduleCleanupCron } from "./utils/dbCleanup";

scheduleCleanupCron()

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
