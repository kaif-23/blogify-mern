const { Schema, model } = require('mongoose');

const blogSchema = new Schema({
    title: {
        type: String,
        required: true, // Fixed typo: 'reqiured' to 'required'
    },
    body: {
        type: String,
        required: true,
    },
    coverImageURL: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Refers to the 'User' model
    },
},
{
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = model('Blog', blogSchema);
