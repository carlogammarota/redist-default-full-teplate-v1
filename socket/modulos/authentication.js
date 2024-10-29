const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const session = require("express-session");

// Aquí puedes implementar la lógica de tu base de datos
const { createUser, findUserByGoogleIdOrEmail, getUserById } = require("./userService"); // Cambia la ruta según tu estructura

module.exports = (app) => {
  // Configuración de la sesión
  app.use(
    session({
      secret: "yourSecretKey", // Cambia esto por una clave segura
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // Cambia a true si usas HTTPS
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Configuración de Passport.js para Google
  passport.use(
    new GoogleStrategy(
      {
        clientID: "YOUR_GOOGLE_CLIENT_ID", // Coloca aquí tu clientID
        clientSecret: "YOUR_GOOGLE_CLIENT_SECRET", // Coloca aquí tu clientSecret
        callbackURL: "http://localhost:3000/auth/google/callback", // Cambia esto si es necesario
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          // Busca al usuario en la base de datos por googleId o email
          const user = await findUserByGoogleIdOrEmail(profile.id, profile.email);

          if (!user) {
            // Si el usuario no existe, lo crea
            const newUser = await createUser({
              googleId: profile.id,
              displayName: profile.displayName,
              email: profile.email,
              imagen: profile.picture,
              name: profile.displayName,
            });
            return done(null, newUser);
          }

          // Si el usuario ya existe, lo usa
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serialización y deserialización de usuario
  passport.serializeUser((user, done) => {
    done(null, user.id); // Usa el ID según tu base de datos
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Rutas de autenticación
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/auth/google/failure",
    }),
    (req, res) => {
      // Redirige al éxito y pasa el token JWT
      const token = req.user.token; // Aquí deberías generar el JWT para el usuario
      res.redirect(
        `https://capillaofer.armortemplate.com/autologin?token=${token}&user_id=${req.user.id}`
      );
    }
  );

  app.get("/auth/google/failure", (req, res) => {
    res.send("Autenticación fallida.");
  });
};
