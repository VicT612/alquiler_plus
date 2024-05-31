// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import MicrosoftProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from 'bcryptjs';
import { JWT } from "next-auth/jwt";
import { Session, User, Account, Profile } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

interface CustomUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'USUARIO'
        } as CustomUser;
      },
    }),
    MicrosoftProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID as string,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
      tenantId: process.env.MICROSOFT_CLIENT_TENANT_ID as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'USUARIO'
        } as CustomUser;
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        contrasena: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.contrasena) {
          throw new Error('Invalid credentials');
        }
        const user = await db.usuario.findUnique({ where: { email: credentials.email } });
        if (user && bcrypt.compareSync(credentials.contrasena, user.contrasena)) {
          return {
            id: user.id.toString(),
            name: user.nombre,
            email: user.email,
            role: user.rol,
          } as CustomUser;
        } else {
          throw new Error('Invalid credentials');
        }
      }
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }: { token: JWT, user?: User | AdapterUser, account?: Account | null, profile?: Profile, isNewUser?: boolean }) {
      if (user) {
        token.id = (user as CustomUser).id;
        token.role = (user as CustomUser).role;
      }
      return token;
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      (session.user as CustomUser).id = token.id as string;
      (session.user as CustomUser).role = token.role as string;
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
