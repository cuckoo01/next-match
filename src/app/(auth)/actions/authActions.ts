'use server';

import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/lib/schemas/loginSchema";
import { registerSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import { ActionResult } from "@/types";
import { User } from "@prisma/client";
import bcrypt from 'bcryptjs'
import { AuthError } from "next-auth";


export async function signInUser(data: LoginSchema): Promise<ActionResult<string>> {
    try {
        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false // don't redirect from the server
        })
        console.log(result)
        
        return {status: 'success', data: 'Logged in'}
    } catch (error) {
        console.log(error)
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {status: 'error', error: 'Invalid credentials'}
                default:
                    return {status: 'error', error: 'Something went wrong'}
            }
        } else {
            return {status: 'error', error: 'Something else went wrong'}
        }
    }
} 

export async function signOutUser() {
    await signOut({redirectTo: '/'})
}

export async function registerUser(data: RegisterSchema): Promise<ActionResult<User>> {
    try {
        // validate data using "zod"
        const validated = registerSchema.safeParse(data)

        if (!validated.success) {
            return {status: 'error', error: validated.error.errors}
        }

        const {name, email, password} = validated.data;

        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of rounds that have to be performed

        const existingUser = await prisma.user.findUnique({
            where: {email}  // where: {email: email}
        })

        if (existingUser) return {status: 'error', error: 'User already exists'}

        // create new user in db
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHashed: hashedPassword
            }
        })
        return {status: 'success', data: user}

    } catch (error) {
        console.log(error)
        return {status: 'error', error: 'Something went wrong'}
    }
}

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({where: {email}})
}

export async function getUserById(id: string) {
    return prisma.user.findUnique({where: {id}})
}

export async function getAuthUserId() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) throw new Error('Unauthorised');

    return userId;
}