import mongoose, { Schema } from 'mongoose';


const messageModel = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    text: {
        type: String,
    },

    image: {
        type: String,
    },

    isRead: {
        type: Boolean,
        default: false
    },

    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },

    deletedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isForwarded: { type: Boolean, default: false },
    originalMessageId: { type: Schema.Types.ObjectId, ref: 'Message' }

}, { timestamps: true });

const messageSchema = mongoose.model('Message', messageModel);
export default messageSchema;
