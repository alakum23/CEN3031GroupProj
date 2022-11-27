const { MongoClient } = require("mongodb");

// Get the connection string from the .env file
const connectionString = process.env.ATLAS_URI;

// Definition for MongoDB
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

// Export some functions to connect to the server and get the connection at any point
module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db("sample_airbnb");
      console.log("Successfully connected to MongoDB.");

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};