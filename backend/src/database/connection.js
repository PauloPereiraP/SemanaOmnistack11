const knex = require('knex');
const configKnex = require('../../knexfile');

const connection = knex(configKnex.development);

module.exports = connection;
