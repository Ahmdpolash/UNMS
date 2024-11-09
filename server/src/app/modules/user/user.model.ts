import { model, Schema } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";
import { UserStatus } from "./user.constant";
const UserSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["student", "faculty", "admin", "superAdmin"],
    },
    status: {
      type: String,
      enum: UserStatus,
      default: "in-progress",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  //hashing the pass
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

//post empty string after saving password
UserSchema.post("save", async function (doc, next) {
  doc.password = "";
  next();
});

UserSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id }).select("+password");
};

UserSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

UserSchema.statics.isJWTIssuedBeforePasswordChanged = async function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;

  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>("Users", UserSchema);
