const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    content: { // Fixed typo: 'conten' to 'content'
        type: String,
        required: true,
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog', // Refers to the 'Blog' model
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Refers to the 'User' model
    },
},
{
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = model('Comment', commentSchema);
