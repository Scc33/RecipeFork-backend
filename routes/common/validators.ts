import { isValidObjectId } from 'mongoose';

import RecipeModel from '../../models/recipe';
import UserModel from '../../models/user';

export const validateUser: (userObj: any, checkUnique: boolean) =>
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

  // enforce pinnedRecipes is a string array
  if ('pinnedRecipes' in userObj === true) {
    if (!(Array.isArray(userObj.pinnedRecipes)) || userObj.pinnedRecipes.some((item: any) => typeof item !== 'string')) {
      validationError = true;
      errorMessages.pinnedRecipes = 'pinnedRecipes should be a string array field';
    } else if (userObj.pinnedRecipes.length > 6) {
      // enforce pinnedRecipes has 6 or less entries
      validationError = true;
      errorMessages.pinnedRecipes = 'pinnedRecipes can only have 6 entries at max';
    } else if ((new Set(userObj.pinnedRecipes)).size !== userObj.pinnedRecipes.length) {
      validationError = true;
      errorMessages.pinnedRecipes = 'pinnedRecipes can only include unique entries';
    } else {
      // enforce allowing only recipes that exist
      const foundRecipes = await RecipeModel.find({ _id: { $in: userObj.pinnedRecipes } });
      if (foundRecipes.length !== userObj.pinnedRecipes.length) {
        validationError = true;
        errorMessages.pinnedRecipes = 'pinnedRecipes can only have ids of recipes that exist';
      }
    }
  }
  

  return [validationError, errorMessages];
};

export const validateRecipe: (recipeObj: any, checkUnique: boolean) =>
Promise<[boolean, Record<string, string>]> = async (recipeObj: any, checkUnique: boolean) => {
  let validationError: boolean = false;
  const errorMessages: Record<string, string> = {};

  let validUserId: boolean = false;
  if (recipeObj.userId !== null) { // allow null to pass through, check further if not null
    if (typeof recipeObj.userId !== 'string') {
      // enforce userId is a string
      validationError = true;
      errorMessages.userId = 'userId should be a string field or null';
    } else if (isValidObjectId(recipeObj.userId) === false) {
      // enforce userId is a string
      validationError = true;
      errorMessages.userId = 'userId should be a valid object id string';
    } else {
      // enforce userId exists
      const userWithId = await UserModel.findById(recipeObj.userId);
      if (userWithId === null && userWithId === undefined) {
        validationError = true;
        errorMessages.userId = `${recipeObj.userId} is not a valid user`;
      } else {
        validUserId = true;
      }
    }
  }

  if ('name' in recipeObj === false) {
    // enforce name requirement
    validationError = true;
    errorMessages.name = 'name is a required field';
  } else if (typeof recipeObj.name !== 'string') {
    // enforce name is a string
    validationError = true;
    errorMessages.name = 'name should be a string field';
  } else if (checkUnique === true && validUserId === true) {
    // enforce uniqueness on name within a user
    const recipesByUser = await RecipeModel.find({ userId: recipeObj.userId });
    if (recipesByUser.some((item) => item.name === recipeObj.name)) {
      validationError = true;
      errorMessages.name = `${recipeObj.name} is already used by this user, please use a unique name`;
    }
  }

  if ('prepTime' in recipeObj === true && recipeObj.prepTime !== null && typeof recipeObj.prepTime !== 'string') {
    // enforce prepTime is a string or null
    validationError = true;
    errorMessages.prepTime = 'prepTime should be a string field or null';
  }

  if ('cookTime' in recipeObj === true && recipeObj.cookTime !== null && typeof recipeObj.cookTime !== 'string') {
    // enforce cookTime is a string or null
    validationError = true;
    errorMessages.cookTime = 'cookTime should be a string field or null';
  }

  if ('ingredients' in recipeObj === false) {
    // enforce ingredients requirement
    validationError = true;
    errorMessages.ingredients = 'ingredients is a required field';
  } else if (typeof recipeObj.ingredients !== 'string') {
    // enforce ingredients is a string
    validationError = true;
    errorMessages.ingredients = 'ingredients should be a string field';
  }

  if ('instructions' in recipeObj === false) {
    // enforce instructions requirement
    validationError = true;
    errorMessages.instructions = 'instructions is a required field';
  } else if (typeof recipeObj.instructions !== 'string') {
    // enforce ingredients is a string
    validationError = true;
    errorMessages.instructions = 'instructions should be a string field';
  }

  if ('tags' in recipeObj === true && (!(Array.isArray(recipeObj.tags)) || recipeObj.tags.some((item: any) => typeof item !== 'string'))) {
    // enforce tags is a string array
    validationError = true;
    errorMessages.tags = 'tags should be a string array field';
  } // TODO: tag enforcement, if applicable

  if ('image' in recipeObj === true && recipeObj.image !== null && typeof recipeObj.image !== 'string') {
    // enforce image is a string or null
    validationError = true;
    errorMessages.images = 'images should be a string field';
  } // TODO: enforce image exists

  if ('forks' in recipeObj === true && typeof recipeObj.forks !== 'number') {
    // enforce forks is a number
    validationError = true;
    errorMessages.forks = 'forks should be a number';
  } else if (recipeObj.forks < 0) {
    // enforce forks is a non-negative number
    validationError = true;
    errorMessages.forks = 'forks should be a non-negative number';
  }

  if ('forkOrigin' in recipeObj === true && recipeObj.forkOrigin !== null && typeof recipeObj.forkOrigin !== 'string') {
    // enforce forkOrigin is a string or null
    validationError = true;
    errorMessages.forkOrigin = 'forkOrigin should be a string field or null';
  } else if ('forkOrigin' in recipeObj === true && recipeObj.forkOrigin !== null) {
    if (isValidObjectId(recipeObj.forkOrigin) === false) {
      validationError = true;
      errorMessages.forkOrigin = 'forkOrigin should be a valid object id string';
    } else {
      const foundRecipe = await RecipeModel.findById(recipeObj.forkOrigin);
      if (foundRecipe === null || foundRecipe === undefined) {
        validationError = true;
        errorMessages.forkOrigin = 'forkOrigin is not pointing to an existing recipe';
      }
    }
  }

  return [validationError, errorMessages];
};
