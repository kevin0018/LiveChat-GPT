var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApiKeySchema = new Schema({
    value: {type: String, required: true},
});

module.exports = mongoose.model('apiKey', ApiKeySchema);
