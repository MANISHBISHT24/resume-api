// models/User.js
// Defines the shape of a "user" and a factory function to create one.
// We're not using a real database/ORM, so a model here is just a
// consistent way to build and describe an object.

function createUser({ id, name, email, password }) {
  return {
    id,
    name: name || 'New User',
    email,
    password, // plaintext only because this is a mock/learning project
    tier: 'free',
    aiCredits: 10,
  };
}

// What we return to the client - never includes the password
function toPublicJSON(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    tier: user.tier,
    aiCredits: user.aiCredits,
  };
}

module.exports = { createUser, toPublicJSON };
