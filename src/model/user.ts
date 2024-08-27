import { Schema, model, Document } from 'mongoose';

interface ITwoFA {
  enabled: boolean;
  method: 'sms' | 'email' | 'authenticator';
  secret?: string;
  otp?: string;
  otpExpiry?: Date;
}

interface IAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

interface IProfile {
  firstName: string;
  lastName: string;
  address: IAddress;
}

export interface IUser extends Document {
  username: string;
  email: string;
  phoneNumber?: string;
  countryCode?: string;
  password: string;
  twoFA: ITwoFA;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  roles: ('user' | 'seller')[];
  profile: IProfile;
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  loginTimestamps: Date[];
  createdAt: Date;
  updatedAt: Date;
}

const TwoFASchema = new Schema({
  enabled: { type: Boolean, default: false },
  method: { type: String, enum: ['sms', 'email', 'authenticator'] },
  secret: { type: String },
  otp: { type: String },
  otpExpiry: { type: Date },
});
const AddressSchema = new Schema({
  line1: { type: String },
  line2: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  zipCode: { type: String },
});
const ProfileSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: AddressSchema,
});

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phoneNumber: { type: String },
  countryCode: { type: String },
  password: { type: String, required: true },
  twoFA: TwoFASchema,
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date },
  roles: { type: [String], enum: ['user', 'seller'], default: ['user'] },
  profile: ProfileSchema,
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  loginTimestamps: [{ type: Date }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = model<IUser>('User', UserSchema, 'User');
export default User;
