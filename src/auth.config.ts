import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { loginSchema } from "./lib/schemas/loginSchema"
import { getUserByEmail } from "./app/(auth)/actions/authActions"
import { compare } from "bcryptjs"
 
export default { 
    providers: [Credentials({
        name: 'credentials',
        async authorize(creds) {
            const validated = loginSchema.safeParse(creds)

            if (validated.success) {
                const {email, password} = validated.data;

                const user = await getUserByEmail(email);

                if (!user || !(await compare(password, user.passwordHashed as string))) return null  // check both email & password

                return user;
            }

            return null;
        }
    })] 
} satisfies NextAuthConfig