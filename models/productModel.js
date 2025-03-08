import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
       type: String,
        required: true 
      },
    price: { 
      type: Number,
      required: true
     },
    category: { 
      type: String, 
      required: true
     },
    images: [
        {
          public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
      ],
    description: { 
      type: String,
       required: true
       },
    location: { 
      type: String,
       required: true
       },
    status: { 
      type: String,
       enum: ["pending", "approved", "rejected"], 
       default: "pending"
       },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    createdAt: { 
      type: Date,
       default: Date.now
       }
});

export const Product = mongoose.model("Product",ProductSchema);
