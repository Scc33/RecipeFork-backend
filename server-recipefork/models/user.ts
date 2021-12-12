import { model, Schema } from 'mongoose';
import User from 'shared-recipefork/interfaces/user';

const schema: Schema = new Schema<User>({
  name: {
    type: String,
    validate: {
      validator: (name: string) => !(name === undefined || name === null || name === ''),
      message: 'name must be defined and non-empty',
    },
    required: [true, 'name is required'],
  },
  email: {
    type: String,
    validate: {
      validator: (email: string) => !(email === undefined || email === null || email === ''),
      message: 'email must be defined and non-empty',
    },
    required: [true, 'email is required'],
    unique: true,
  },
  profilePic: {
    type: String,
    default: null,
  },
  recipes: {
    type: [String],
    validate: {
      validator: (recipes: [string]) => !(recipes === undefined || recipes === null),
      message: 'pinnedRecipes, if included, must be defined',
    },
  },
  pinnedRecipes: {
    type: [String],
    validate: {
      validator: (pinnedRecipes: [string]) => !(
        pinnedRecipes === undefined
        || pinnedRecipes === null
        || pinnedRecipes.length <= 6),
      message: 'pinnedRecipes, if included, must be defined and have 6 or less elements',
    },
  },
  forks: {
    type: Number,
    validate: {
      validator: (forks: number) => !(forks === undefined || forks === null || forks < 0),
      message: 'forks must be defined and be non-negative',
    },
  },
});

const UserModel = model<User>('User', schema);

export default UserModel;
