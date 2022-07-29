import { dotenv } from "../src/dependencies";

import { seedDatabase } from "./seeder";
import { createAllIndexes } from "./indexer";


dotenv.config();

const seedAndIndexData = async () => {
    await seedDatabase();
    await createAllIndexes();
};


seedAndIndexData();