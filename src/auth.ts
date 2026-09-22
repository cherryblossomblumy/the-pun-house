import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (
          typeof email !== "string" ||
          typeof password !== "string"
        ) {
          return null;
        }

        if (
          email !== process.env.ADMIN_EMAIL ||
          password !== process.env.ADMIN_PASSWORD
        ) {
          return null;
        }

        return {
          id: "admin",
          email,
          name: "Pun House Admin",
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
});