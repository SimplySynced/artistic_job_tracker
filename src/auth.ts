import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs";

// Salting and hashing password function
export const saltAndHashPassword = async (plaintextPassword: string): Promise<string> => {
    const saltRounds = 10; // Recommended salt rounds
    return bcrypt.hash(plaintextPassword, saltRounds);
};

// Function to get user from the database
export const getUserFromDb = async (email: string, plaintextPassword: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return null; // User not found
    }

    // Compare the plaintext password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(plaintextPassword, user.password);

    if (!isPasswordValid) {
        return null; // Password mismatch
    }

    // Return user data (excluding sensitive information like password)
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified || null,
    };
};

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Type narrowing for credentials
                if (!credentials || typeof credentials.email !== "string" || typeof credentials.password !== "string") {
                    throw new Error("Invalid credentials format.");
                }

                const { email, password } = credentials;

                // Verify user using the custom `getUserFromDb` function
                const user = await getUserFromDb(email, password);

                if (!user) {
                    throw new Error("Invalid email or password.");
                }

                // Return user object for NextAuth
                return user;
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/signout",
    },
    session: {
        strategy: "jwt", // Use JWT for session handling
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                id: token.id as string,
                name: token.name as string,
                email: token.email as string,
                emailVerified: token.emailVerified as Date | null,
            };
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
})