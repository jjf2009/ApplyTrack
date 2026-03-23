const mongoose = require("mongoose");
const hashPassword = require("./hooks/userHooks");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add your name"],
      maxlength: [100, "Name length cannot exceed 100 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Kindly enter a valid email"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      match: [
        /^[A-Z]{2}[a-z]{2}[0-9]{2}$/,
        "Password should be 2 uppercase, 2 lowercase, 2 numbers",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

hashPassword(UserSchema);

module.exports = mongoose.model("User", UserSchema);
