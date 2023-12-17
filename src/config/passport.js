import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { Users } from "../dao/models/index.js";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config();

export const passportStrategy = () => {
  const registerOpts = {
    usernameField: "email",
    passReqToCallback: true,
  };

  passport.use(
    "register",
    new LocalStrategy(registerOpts, async (req, email, password, done) => {
      const { firstName, lastName, age } = req.body;

      if (!firstName || !lastName) {
        return done(new Error("Todos los campos son requeridos"));
      }

      const user = await Users.findOne({ email });

      if (user)
        return done(new Error(`El correo ${email} ya ha sido registrado.`));

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await Users.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        age,
      });
      return done(null, newUser);
    })
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        //if a param ain't exist, passport throw an error
        const user = await Users.findOne({ email });

        if (!user) return done(new Error("Correo o contraseña invalidos"));
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return done(new Error("Correo o contraseña invalidos"));

        done(null, user);
      }
    )
  );

  const githubOpts = {
    clientID: process.env.CLIENTID_GITHUB,
    clientSecret: process.env.CLIENTSECRET_GITHUB,
    callbackURL: process.env.CALLBACKURL_GITHUB,
  };
  passport.use(
    "github",
    new GithubStrategy(
      githubOpts,
      async (accesstoken, refreshToken, profile, done) => {
        const email = profile._json.email;
        let user = await Users.findOne({ email });
        if (user) return done(null, user);

        user = {
          firstName: profile._json.name,
          lastName: "",
          email,
          password: "",
          age: 23,
        };

        const newUser = await Users.create(user);
        done(null, newUser);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (uid, done) => {
    const user = await Users.findById(uid);
    done(null, user);
  });
};

//1:26:30
