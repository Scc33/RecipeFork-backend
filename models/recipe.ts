import { model, Schema } from 'mongoose';
// Load required packages
const mongoose = require('mongoose');

interface Recipe {
  name: string,
  userId: string,
  prepTime: string,
  cookTime: string,
  ingredients: [string],
  instructions: [string],
  tags: [string],
  image: [string],
  forks: number,
  forkOrigin: string,
}

// Define our recipe schema
const schema: Schema = new Schema<Recipe>({
  name: String,
  userId: String,
  prepTime: String,
  cookTime: String,
  ingredients: [String],
  instructions: [String],
  tags: [String],
  image: [String],
  forks: Number,
  forkOrigin: String,
});

// Export the Mongoose model
module.exports = mongoose.model('Recipe', schema);
