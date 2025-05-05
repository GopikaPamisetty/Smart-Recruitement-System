import mongoose from "mongoose";
import { User } from "./models/userModel.js"; // Import your model

const atlasURI = "mongodb+srv://GopikaPamisetty:g%40pi2917@cluster0.fyguyfb.mongodb.net/jobportal";
const localURI = "mongodb://127.0.0.1:27017/jobportal";

const syncUsers = async () => {
  try {
    // Extract the schema from the User model
    const userSchema = User.schema;

    // Connect to both DBs
    const atlasConn = await mongoose.createConnection(atlasURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const localConn = await mongoose.createConnection(localURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Reuse the same schema for both
    const AtlasUser = atlasConn.model("User", userSchema);
    const LocalUser = localConn.model("User", userSchema);

    const users = await AtlasUser.find();

    await LocalUser.deleteMany({});
    await LocalUser.insertMany(users);

    console.log(`✅ Synced ${users.length} users from Atlas to Localhost`);

    await atlasConn.close();
    await localConn.close();
  } catch (error) {
    console.error("❌ Sync failed:", error.message);
  }
};

syncUsers();
