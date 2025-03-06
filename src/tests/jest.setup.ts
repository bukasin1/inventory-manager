import dotenv from "dotenv";
import { isTestingLocalhost } from "./utils";
dotenv.config();

const setup = async () => {
  isTestingLocalhost();
};

export default setup;
