import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

// const messageSchema = new mongoose.Schema({
//   sender: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'userModel',
//     required: true
//   },
//   content: {
//     type: String,
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

const conversationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Conversation is required."],
      trim: true,
    },
    isGroup: {
      type: Boolean,
      required: true,
      default: false,
    },
    users: [
      {
        type: ObjectId,
        ref: "UserModel",
      },
    ],
    latestMessage: {
      type: ObjectId,
      ref: "MessageModel",
    },
    admin: [
      {
        type: ObjectId,
        ref: "UserModel",
      },
    ],
  },
  {
    collection: "conversations",
    timestamps: true,
  }
);

const ConversationModel =
  mongoose.models.ConversationModel ||
  mongoose.model("ConversationModel", conversationSchema);

export default ConversationModel;
