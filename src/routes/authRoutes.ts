import { Router } from 'express';
import { Strategy } from '@superfaceai/passport-twitter-oauth2';
import passport from 'passport'


import { User } from "../models/userModel";


// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser(function (id: Express.User, done) {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(e => {
      done(new Error("Failed to deserialize an user"));
    });
});


passport.use(
  new Strategy(
    {
      clientType: 'private',
      clientID: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      callbackURL: process.env.CALLBACK_URL as string
    },
    async (accessToken, refreshToken, profile: any, done) => {

      console.log('Success!');
      // find current user in UserModel
      const currentUser = await User.findOne({
        twitterId: profile._json.id
      });

      // create new user if the database doesn't have this user
      if (!currentUser) {
        const newUser = await new User({
          name: profile._json.name,
          username: profile._json.username,
          twitterId: profile._json.id,
          profileImageUrl: profile._json.profile_image_url
        }).save();
        if (newUser) {
          done(null, newUser);
          return;
        }
      }
      if (currentUser) {
        done(null, currentUser);

        return;
      }
    }
  )
);



export const authRoutes = Router();
// when login is successful, retrieve user info
authRoutes.get("/login/success", function (req, res, done) {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }
});

// when login failed, send failed msg
authRoutes.get("/login/failed", function (req, res, done) {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

// When logout, redirect to client
authRoutes.get("/logout", function (req, res, done) {
  req.logout(done);
  res.redirect(process.env.ORIGIN_URL + "/");

});

// auth with twitter
authRoutes.get("/twitter", passport.authenticate('twitter', {

  scope: ['tweet.read', 'users.read', 'offline.access'],
}));

// redirect to home page after successfully login via twitter
authRoutes.get(
  "/twitter/redirect",
  passport.authenticate("twitter", {
    successRedirect: process.env.ORIGIN_URL + "/",
    failureRedirect: process.env.FAILURE_REDIRECT
  })
);


