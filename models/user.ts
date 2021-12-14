import { model, Schema } from 'mongoose';

interface User {
  username: string,
  email: string,
  profilePic: string,
  pinnedRecipes: [string],
}

const schema: Schema = new Schema<User>({
  username: {
    type: String, required: [true, 'username is required'], unique: true,
  },
  email: {
    type: String, required: [true, 'email is required'], unique: true,
  },
  profilePic: {
    type: String, default: null,
  },
  pinnedRecipes: {
    type: [String],
  },
});

const UserModel = model<User>('User', schema);

export default UserModel;
