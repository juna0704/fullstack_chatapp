import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add password"],
      minlength: [6, "Password must be at least 6 characters long"],
      validate: {
        validator: function (password) {
          // At least one uppercase, one lowercase, one number, one special character
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
            password
          );
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      },
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: function (phone) {
          // Only validate if phone is provided
          return !phone || /^[+]?[\d\s\-()]{10,15}$/.test(phone);
        },
        message: "Please provide a valid phone number",
      },
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      trim: true,
    },
    profilePic: {
      type: String,
      default: "",
      validate: {
        validator: function (url) {
          // Only validate if URL is provided
          return !url || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
        },
        message: "Please provide a valid image URL",
      },
    },
    securityQuestion: {
      type: String,
      trim: true,
    },

    securityAnswer: {
      type: String,
      trim: true,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpire: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    lastLogin: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "auto"],
        default: "light",
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        sms: {
          type: Boolean,
          default: false,
        },
        push: {
          type: Boolean,
          default: true,
        },
      },
    },
  },
  {
    timestamps: true,

    versionKey: false, // Remove __v field
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpire;
        delete ret.securityAnswer;
        delete ret.emailVerificationToken;
        delete ret.emailVerificationExpire;
        return ret;
      },
    },
  }
);

const User = mongoose.model("User", userSchema);

export default User;
