import app from "./app";
import "./utils/dbCleanup";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
