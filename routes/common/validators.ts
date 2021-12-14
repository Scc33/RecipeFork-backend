import UserModel from '../../models/user';

const validateUser: (userObj: any, checkUnique: boolean) =>
Promise<[boolean, Record<string, string>]> = async (userObj: any, checkUnique: boolean) => {
  let validationError: boolean = false;
  const errorMessages: Record<string, string> = {};

  if ('username' in userObj === false) {
    // enforce username requirement
    validationError = true;
    errorMessages.username = 'username is a required field';
  } else if (typeof userObj.username !== 'string') {
    // enforce username is a string
    validationError = true;
    errorMessages.username = 'username should be a string field';
  } else if (checkUnique === true) {
    // enforce uniqueness on username
    const userWithUsername = await UserModel.findOne({ username: userObj.username });
    if (userWithUsername !== null && userWithUsername !== undefined) {
      validationError = true;
      errorMessages.username = `${userObj.username} is already used by another user, please use a unique username`;
    }
  }

  if ('email' in userObj === false) {
    // enforce email requirement
    validationError = true;
    errorMessages.email = 'email is a required field';
  } else if (typeof userObj.email !== 'string') {
    // enforce email is a string
    validationError = true;
    errorMessages.email = 'email should be a string field';
  } else if (checkUnique === true) {
    // enforce uniqueness on email
    const userWithEmail = await UserModel.findOne({ email: userObj.email });
    if (userWithEmail !== null && userWithEmail !== undefined) {
      validationError = true;
      errorMessages.email = `${userObj.email} is already used by another user, please use a unique email`;
    }
  }

  // enforce profilePic is a string or null
  if ('profilePic' in userObj === true && userObj.profilePic !== null && typeof userObj.profilePic !== 'string') {
    validationError = true;
    errorMessages.profilePic = 'profilePic should be a string field or null';
  } // TODO: image exists?

  // enforce recipes is a string array
  if ('recipes' in userObj === true && (!(Array.isArray(userObj.recipes)) || userObj.recipes.some((item: any) => typeof item !== 'string'))) {
    validationError = true;
    errorMessages.recipes = 'recipes should be a string array field';
  } // TODO: enforce all recipes exist, user owns the recipes in the list

  // enforce pinnedRecipes is a string array
  if ('pinnedRecipes' in userObj === true && (!(Array.isArray(userObj.pinnedRecipes)) || userObj.pinnedRecipes.some((item: any) => typeof item !== 'string'))) {
    validationError = true;
    errorMessages.pinnedRecipes = 'pinnedRecipes should be a string array field';
  } else if (userObj.length > 6) {
    // enforce pinnedRecipes has 6 or less entries
    validationError = true;
    errorMessages.pinnedRecipes = 'pinnedRecipes can only have 6 entries at max';
  } // TODO: enforce all recipes exist

  return [validationError, errorMessages];
};

export default validateUser;
