const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["applied", "interview", "offer", "rejected"],
      default: "applied",
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    },
    link: {
      type: String,
    },
  },
  { timestamps: true },
);

ApplicationSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Application",ApplicationSchema);