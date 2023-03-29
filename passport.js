const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const users = require("./users.js");

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "random string";

module.exports = function () {
  var strategy = new JwtStrategy(opts, function (jwt_payload, done) {
    users.find((user) => {
      if (jwt_payload.username === user.username) {
        return done(null, user);
      }
    });
  });
  passport.use(strategy);
};
