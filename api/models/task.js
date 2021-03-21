import mongoose from 'mongoose';

let Task = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Ooops! Title is required.'],
        unique: true
    },
    owner: {
        type: String,
        required: [true, 'Ooops! Owner is required.']
    },
    done: Boolean
});

export default mongoose.model('Task', Task);