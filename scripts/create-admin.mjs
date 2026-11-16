// Usage:  npm run create-admin -- you@example.com "Strong passphrase" admin
// Creates or updates an admin user. Role: admin (full access) | editor (no deletes, no subscriber list).
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { readFileSync, existsSync } from "node:fs";

// Minimal .env.local loader so the script works without extra packages.
for (const f of [".env.local", ".env"]) {
  if (!existsSync(f)) continue;
  for (const line of readFileSync(f, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const [email, password, role = "admin"] = process.argv.slice(2);
if (!email || !password) {
  console.error('Usage: npm run create-admin -- <email> "<password>" [admin|editor]');
  process.exit(1);
}
if (password.length < 12) {
  console.error("Use a password of at least 12 characters.");
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set (add it to .env.local).");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);
const Admin =
  mongoose.models.Admin ||
  mongoose.model(
    "Admin",
    new mongoose.Schema(
      { email: { type: String, unique: true, lowercase: true }, name: String, passwordHash: String, role: String, lastLoginAt: Date },
      { timestamps: true }
    )
  );
const passwordHash = await bcrypt.hash(password, 12);
await Admin.updateOne({ email: email.toLowerCase() }, { $set: { passwordHash, role } }, { upsert: true });
console.log(`✔ ${role} account ready for ${email}`);
await mongoose.disconnect();
