'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema(
    {
        first_name: {
            type: String
        },
        last_name: {
            type: String
        },
        email: {
            type: String
        },
        profile_url: {
            type: String
        },

    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        },
        collection: 'Users'
    }
);

/**
 * Defines the schema for users
 */
module.exports = mongoose.model('Users', UsersSchema);
