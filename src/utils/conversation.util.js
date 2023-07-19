import validator from "validator";
import createHttpError from "http-errors";

// // this is what should go to the database

// {
//     name: "Example Conversation",
//     isGroup: false,
//     users: [
//       ObjectId("user1Id"),
//       ObjectId("user2Id"),
//       ObjectId("user3Id")
//     ],
//     latestMessage: ObjectId("messageId"),
//     admin: ObjectId("adminUserId")
//   }

export const validateConversationName = (name) => {
  // name should be at least 4 characters and not more than 60 characters
  if (!validator.isLength(name, { min: 4, max: 60 })) {
    throw createHttpError.BadRequest(
      "The conversation name should be at least 4 characters and not more than 60 characters."
    );
  }

  return name;
};

export const validateConversationUsers = (users) => {
  // since users is an array, we need to check if there are at least 2 users
  if (users.length < 2) {
    throw createHttpError.BadRequest(
      "The conversation should have at least 2 users."
    );
  }

  // we need to check if the users are valid and if they are not duplicated
  const uniqueUsers = [...new Set(users)];
  if (uniqueUsers.length !== users.length) {
    throw createHttpError.BadRequest(
      "The conversation should not have duplicated users."
    );
  }

  return users;
};

export const validateConversationAdmin = (admin) => {
  // admin should be a valid user
  if (!validator.isMongoId(admin)) {
    throw createHttpError.BadRequest("The conversation admin is not valid.");
  }

  return admin;
};

export const validateConversationIsGroup = (isGroup, users) => {
  // For a conversation to be a group, it should have at least 2 users
  if (isGroup && users.length < 2) {
    throw createHttpError.BadRequest(
      "The conversation should have at least 2 users to be a group."
    );
  }
};
