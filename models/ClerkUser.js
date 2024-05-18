import mongoose from 'mongoose';

const ClerkUserSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  email_address: { type: String},
  role: {
    type: String,
    enum: ["admin", "superadmin"],
    default: "admin"
    },
  company_id: { type: String },
});

const ClerkUser = mongoose.model('ClerkUser', ClerkUserSchema);

export default ClerkUser;