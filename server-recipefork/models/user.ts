import { model, Schema } from 'mongoose';
import User from 'shared-recipefork/interfaces/user';

const schema: Schema = new Schema<User>({
  username: {
    type: String, required: [true, 'username is required'],
  },
  email: {
    type: String, required: [true, 'email is required'], unique: true,
  },
  profilePic: {
    type: String, default: null,
  },
  recipes: {
    type: [String],
  },
  pinnedRecipes: {
    type: [String],
  },
});

const UserModel = model<User>('User', schema);

export default UserModel;
