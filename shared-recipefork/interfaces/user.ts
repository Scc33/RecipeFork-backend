interface User {
  name: string,
  email: string,
  profilePic: string,
  recipes: [string],
  pinnedRecipes: [string],
  forks: number,
};

export default User;