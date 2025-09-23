const mongoose = require("mongoose");
const crypto = require("crypto");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: function () {
      return !this.googleId; // Address not required for OAuth users initially
    },
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure the email is unique in the database
    lowercase: true, // Ensure the email is stored in lowercase
    match: [/\S+@\S+\.\S+/, "is invalid"], // Simple email format validation
  },
  contact: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    set: function (value) {
      if (!value) return value;
      const algorithm = "aes-256-cbc";
      const keyHex = process.env.CONTACT_ENCRYPTION_KEY;
      if (!keyHex || keyHex.length !== 64) return value; // 32 bytes in hex
      const key = Buffer.from(keyHex, "hex");
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      let encrypted = cipher.update(value, "utf8", "hex");
      encrypted += cipher.final("hex");
      return iv.toString("hex") + ":" + encrypted;
    },
    get: function (value) {
      if (!value) return value;
      const algorithm = "aes-256-cbc";
      const keyHex = process.env.CONTACT_ENCRYPTION_KEY;
      if (!keyHex || keyHex.length !== 64) return value;
      const key = Buffer.from(keyHex, "hex");
      const parts = value.split(":");
      if (parts.length !== 2) return value;
      const iv = Buffer.from(parts[0], "hex");
      const encryptedText = parts[1];
      try {
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
      } catch (err) {
        return value; // fallback to raw value if decryption fails
      }
    },
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // Password not required for OAuth users
    },
    validate: {
      validator: function (v) {
        // Skip validation for OAuth users
        if (this.googleId) return true;
        // At least 8 chars, one uppercase, one lowercase, one number, one special char
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
          v
        );
      },
      message:
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
    },
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "collector", "resident", "recorder"], // Allow only specific roles
  },
  // OAuth fields
  googleId: {
    type: String,
    sparse: true, // Allows null values but ensures uniqueness when present
  },
  avatar: {
    type: String,
  },
  isOAuthUser: {
    type: Boolean,
    default: false,
  },
  // Email verification fields
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
  },
});

userSchema.plugin(AutoIncrement, { inc_field: "id" });

userSchema.set('toObject', { getters: true });
userSchema.set('toJSON', { getters: true });

const User = mongoose.model("User", userSchema);

module.exports = User;