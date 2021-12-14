import { model, Schema } from 'mongoose';

interface Recipe {
  userId: string,
  name: string,
  prepTime: string,
  cookTime: string,
  ingredients: [string],
  instructions: [string],
  tags: [string],
  images: [string],
  forks: number,
  forkOrigin: string,
}

// Define our recipe schema
const schema: Schema = new Schema<Recipe>({
  userId: { type: String, default: null },
  name: { type: String, required: [true, 'name is required'] },
  prepTime: { type: String, default: null },
  cookTime: { type: String, default: null },
  ingredients: { type: [String], required: [true, 'ingredients are required'] },
  instructions: { type: [String], required: [true, 'instructions are required'] },
  tags: [String],
  images: [String],
  forks: { type: Number, default: 0 },
  forkOrigin: { type: String, default: null },
});

const RecipeModel = model<Recipe>('Recipe', schema);

export default RecipeModel;
