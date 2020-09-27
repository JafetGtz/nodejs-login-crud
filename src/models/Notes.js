const mongoose = require('mongoose');

const { Schema } = mongoose;

const NoteSchema = new Schema({
    title: { type: String, required: true },
    description: {  type: String, required: true },
    date: { type: Date, default: Date.now  },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Note', NoteSchema);