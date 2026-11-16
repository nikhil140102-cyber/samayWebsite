// All Mongoose models in one place. `mongoose.models.X ||` keeps hot reload safe.
import mongoose from "mongoose";

const { Schema } = mongoose;
const model = (name, schema) => mongoose.models[name] || mongoose.model(name, schema);
const opts = { timestamps: true };

export const Product = model(
  "Product",
  new Schema(
    {
      slug: { type: String, required: true, unique: true, index: true },
      name: { type: String, required: true },
      category: { type: String, required: true },
      price: { type: Number, min: 0 }, // INR, whole rupees (omit for concepts)
      concept: { type: Boolean, default: false },
      description: String,
      images: [String],
      sizes: [String],
      colors: [String],
      shipping: String,
      stock: { type: Number, default: 0 },
      purchasable: { type: Boolean, default: true },
      externalUrl: String,
      licenseNote: String,
      published: { type: Boolean, default: true },
    },
    opts
  )
);

export const Show = model(
  "Show",
  new Schema(
    {
      slug: { type: String, required: true, unique: true, index: true },
      title: { type: String, required: true },
      tour: String,
      city: { type: String, required: true },
      venue: { type: String, required: true },
      address: String,
      startDate: { type: String, required: true }, // YYYY-MM-DD
      endDate: String,
      dateLabel: String,
      priceFrom: Number,
      gatesOpen: String,
      status: { type: String, enum: ["on-sale", "sold-out", "coming-soon", "cancelled"], default: "on-sale" },
      districtUrl: { type: String, required: true },
      poster: String,
      notes: [String],
      published: { type: Boolean, default: true },
    },
    opts
  )
);

export const Video = model(
  "Video",
  new Schema(
    {
      youtubeId: { type: String, required: true, unique: true },
      title: { type: String, required: true },
      description: String,
      publishedAt: String,
      kind: { type: String, enum: ["video", "short"], default: "video" },
      featured: { type: Boolean, default: false },
      published: { type: Boolean, default: true },
    },
    opts
  )
);

export const GalleryImage = model(
  "GalleryImage",
  new Schema(
    {
      slug: { type: String, required: true, unique: true },
      title: { type: String, required: true },
      category: { type: String, required: true },
      src: { type: String, required: true },
      width: Number,
      height: Number,
      credit: { type: String, required: true },
      sourceUrl: String,
      published: { type: Boolean, default: true },
    },
    opts
  )
);

export const AffiliateProduct = model(
  "AffiliateProduct",
  new Schema(
    {
      slug: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      category: { type: String, required: true },
      description: String,
      query: String, // Amazon search query, used when no ASIN is set
      asin: String, // specific product
      icon: String,
      published: { type: Boolean, default: true },
    },
    opts
  )
);

export const Newsletter = model(
  "Newsletter",
  new Schema(
    {
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      name: String,
      consentAt: { type: Date, required: true },
      consentText: String,
      source: String,
      ipHash: String,
      unsubscribed: { type: Boolean, default: false },
    },
    opts
  )
);

export const FanSubmission = model(
  "FanSubmission",
  new Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      imageUrl: { type: String, required: true },
      caption: String,
      consentAt: { type: Date, required: true },
      status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    },
    opts
  )
);

export const ContactMessage = model(
  "ContactMessage",
  new Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      subject: String,
      message: { type: String, required: true },
      handled: { type: Boolean, default: false },
    },
    opts
  )
);

export const Order = model(
  "Order",
  new Schema(
    {
      items: [
        {
          productId: String,
          slug: String,
          name: String,
          price: Number,
          quantity: Number,
          size: String,
          color: String,
        },
      ],
      subtotal: Number, // INR
      amount: Number, // paise, as charged
      currency: { type: String, default: "INR" },
      customer: { name: String, email: String, phone: String, address: String, pincode: String },
      razorpayOrderId: { type: String, index: true },
      razorpayPaymentId: String,
      status: { type: String, enum: ["created", "paid", "failed", "refunded"], default: "created" },
      paidAt: Date,
    },
    opts
  )
);

export const Admin = model(
  "Admin",
  new Schema(
    {
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      name: String,
      passwordHash: { type: String, required: true },
      role: { type: String, enum: ["admin", "editor"], default: "editor" },
      lastLoginAt: Date,
    },
    opts
  )
);

export const SiteContent = model(
  "SiteContent",
  new Schema(
    {
      key: { type: String, default: "home", unique: true },
      logo: String, // https URL or small data:image/* (≤ ~350 KB)
      heroHeading: String,
      heroSubheading: String,
      heroText: String,
      heroImage: String,
      heroImageCredit: String,
      announcement: String,
    },
    opts
  )
);
