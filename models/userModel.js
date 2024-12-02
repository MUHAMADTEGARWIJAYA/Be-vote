import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nim: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return value.includes("061") && value.length <= 10;
      },
      message: "NIM harus mengandung '061' dan maksimal 10 digit.",
    },
  },
  hasVoted: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
