interface User {
  username: string,
  email: string,
  profilePic: string,
  recipes: [string],
  pinnedRecipes: [string],
};

export default User;