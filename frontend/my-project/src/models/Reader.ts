import mongoose from "mongoose";

type Reader= {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const readerSchema = new mongoose.Schema<Reader>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true }
});

export const Reader = mongoose.model('Reader', readerSchema);