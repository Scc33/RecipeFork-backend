# 🍴 RecipeFork-backend

Backend repository for Recipe Fork, a website for creating, sharing and forking off of existing recipes. Built by Team Never Gonna Give You Up for CS 498RK The Art of Web Programming (Fall 2021).

Frontend repository can be found [here](https://github.com/Scc33/RecipeFork-frontend). Originally located [here](https://gitlab.com/seanmc4/recipefork-frontend).

### Resources
- Deployed to Heroku, can be found [here](https://recipefork-backend.herokuapp.com)
- [Credit for the CI setup](https://medium.com/swlh/how-do-i-deploy-my-code-to-heroku-using-gitlab-ci-cd-6a232b6be2e4)
- Look into [this](https://medium.com/@morgannewman/how-to-keep-your-free-heroku-app-online-forever-4093ef69d7f5) for keeping the app up and running.

## Documentation

### Schemas

User schema:
| Field | Type | Required | Unique | Default | Notes |
|-------|------|----------|--------|---------|-------|
| username | string | ✓ | ✓ | - | - |
| email | string | ✓ | ✓ | - | linked to Firebase authentication |
| profilePic | string? | ✘ | ✘ | null | url to image hosting service |
| pinnedRecipes | [string] | ✘ | ✘ | [] | document IDs, 6 or less recipes, can be owned by anyone |

Recipe schema:
| Field | Type | Required | Unique | Default | Notes |
|-------|------|----------|--------|---------|-------|
| name | string | ✓ | ✓* | - | *unique per user |
| userId | string? | ✘ | ✘ | null | document ID for author, can also be null if users's account is deleted |
| prepTime | string? | ✘ | ✘ | null | - |
| cookTime | string? | ✘ | ✘ | null | - |
| ingredients | string | ✓ | ✘ | - | - |
| instructions | string | ✓ | ✘ | - | - |
| tags | [string] | ✘ | ✘ | [] | hardcoded in frontend, not user creatable |
| image | string? | ✘ | ✘ | null | url to image hosting service |
| forks | number | ✘ | ✘ | 0 | non-negative only |
| forkOrigin | string? | ✘ | ✘ | null | document ID for source recipe |

Images schema:
| Field | Type | Required | Unique | Default | Notes |
|-------|------|----------|--------|---------|-------|
| base64 | string | ✓ | ✘ | - | Base64 encoding of image |
| format | string | ✓ | ✘ | - | Denotes filetype, unused by frontend |

### Endpoints

These are the following endpoints available:

| Endpoints  | Actions | Intended Outcome                                        |
|------------|---------|---------------------------------------------------------|
| users      | GET     | Respond with a List of users                            |
|            | POST    | Create a new user. Respond with details of new user     |
| users/:id  | GET     | Respond with details of specified user or 404 error     |
|            | PUT     | Replace entire user with supplied user or 404 error     |
|            | DELETE  | Delete specified user or 404 error                      |
| recipes    | GET     | Respond with a List of recipes                          |
|            | POST    | Create a new recipe. Respond with details of new recipe |
| recipes/:id| GET     | Respond with details of specified recipe or 404 error   |
|            | PUT     | Replace entire recipe with supplied recipe or 404 error |
|            | DELETE  | Delete specified recipe or 404 error                    |
| images    | GET     | Respond with a List of images                          |
|            | POST    | Create a new image. Respond with details of new image |
| images/:id| GET     | Respond with details of specified image or 404 error   |
|            | PUT     | Replace entire image with supplied image or 404 error |
|            | DELETE  | Delete specified image or 404 error                    |

Side effects:
- DELETE on `users/:id` will make the user's authored recipes userID null
- DELETE on `recipes/:id` will pull the recipe from all users that have pinned the recipe

### Query Parameters

Additionally, the API has the following JSON encoded query string parameters for GET requests to `users`, `users/:id`, `recipes` and `recipes/:id`.

| Parameter | Description                                                                                  |
|----------|----------------------------------------------------------------------------------------------|
| where    | filter results based on JSON query                                                           |
| sort     | specify the order in which to sort each specified field  (1- ascending; -1 - descending)     |
| select   | specify the set of fields to include or exclude in each document  (1 - include; 0 - exclude) |
| skip     | specify the number of results to skip in the result set; useful for pagination               |
| limit    | specify the number of results to return (default should be 100 for tasks and unlimited for users)                    |
| count    | if set to true, return the count of documents that match the query (instead of the documents themselves)                    |
