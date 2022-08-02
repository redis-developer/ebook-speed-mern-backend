import { dotenv } from "../src/dependencies";
import { seedDatabase } from "./seeder";

dotenv.config();

const seedData = async () => {
    await seedDatabase();
    //use atlas UI to index data
};


seedData();