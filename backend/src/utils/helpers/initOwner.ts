import bcrypt from "bcrypt";
import User from "../../models/userModel";

const initOwner = async () => {
  try {
    // Check if a user with the role "Owner" exists
    const ownerUser = await User.findOne({ roles: "Owner" });

    if (ownerUser) {
      console.log("Owner user already exists.");
      return;
    }

    // Check if admin_username and admin_password are set in the environment variables
    const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      console.log(
        "ADMIN_USERNAME and ADMIN_PASSWORD must be set to create an Owner user.",
      );
      return;
    }

    // Hash the admin password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Create the Owner user
    const newUser = new User({
      username: ADMIN_USERNAME,
      password: hashedPassword,
      roles: ["Owner", "Admin", "user"],
      email: "admin@example.com",
    });

    await newUser.save();
    console.log("Owner user created successfully.");
  } catch (error) {
    console.error("Error during Owner user initialization:", error);
  }
};

export default initOwner;
