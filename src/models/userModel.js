import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name."],
      minLength: [4, "Name should be at least 4 characters."],
      maxLength: [60, "Password should not be more than 60 characters."],
    },
    email: {
      type: String,
      required: [true, "Please enter your email."],
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email."],
      lowercase: true,
    },
    picture: {
      type: String,
      default:
        "https://res.cloudinary.com/dkd5jblv5/image/upload/v1675976806/Default_ProfilePicture_gjngnb.png",
      validate: [validator.isURL, "Please enter a valid URL."],
    },
    status: {
      type: String,
      default: "Hello there, I am using this app.",
      minLength: [4, "Status should be at least 4 characters."],
      maxLength: [60, "Status should not be more than 60 characters."],
    },
    password: {
      type: String,
      required: [true, "Please enter your password."],
      minLength: [6, "Password should be at least 6 characters."],
      maxLength: [120, "Password should not be more than 120 characters."],
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
  } catch (error) {
    next(error);
  }
});

const userModel =
  mongoose.models.UserModel || mongoose.model("UserModel", userSchema);

export default userModel;
