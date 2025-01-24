'use client'

import { registerSchema, RegisterSchema } from '@/lib/schemas/registerSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { GiPadlock } from 'react-icons/gi'
import { registerUser } from '../actions/authActions'

export default function RegisterForm() {
    const {register, handleSubmit, setError, formState: {errors, isValid, isSubmitting}} = useForm<RegisterSchema>({
        // resolver: zodResolver(registerSchema),   // validated immediately when clicking out of the input
        mode: 'onTouched'
    })

    // validate on clicking "Submit" btn
    const onSubmit = async (data: RegisterSchema) => {
        const result = await registerUser(data)
        console.log(result)
        if (result.status === 'success') {
            console.log('User registered successfully!')
        } else {
            if (Array.isArray(result.error)) {
                result.error.forEach((e) => {
                    const fieldName = e.path.join('.') as 'email' | 'name' | 'password';
                    setError(fieldName, {message: e.message})
                })
            } else {
                setError('root.serverError', {message: result.error})
            }
        }
    }

    return (
        <Card className='w-2/5 mx-auto'>
            <CardHeader className='flex flex-col items-center justify-center text-center'>
                <div className='flex flex-col gap-2 items-center text-secondary-50'>
                    <div className='flex flex-row items-center gap-3'>
                        <GiPadlock size={30}/>
                        <h1 className='text-3xl font-semibold'>Register</h1>
                    </div>
                    <p className='text-neutral-500'>Welcome to NextMatch</p>
                </div>
            </CardHeader>

            <CardBody>
                <form onSubmit={handleSubmit(onSubmit)}> 
                    <div className='space-y-4'>
                        <Input 
                            defaultValue=''
                            label='Name'
                            variant='bordered'
                            {...register('name')}
                            isInvalid={!!errors.name}
                            errorMessage={errors.name?.message as string}
                        />
                        <Input 
                            defaultValue=''
                            label='Email'
                            variant='bordered'
                            {...register('email')}
                            isInvalid={!!errors.email}
                            errorMessage={errors.email?.message as string}
                        />
                        <Input 
                            defaultValue=''
                            label='Password' 
                            variant='bordered'
                            type='password'
                            {...register('password')}
                            isInvalid={!!errors.password}
                            errorMessage={errors.password?.message as string}
                        />
                        {errors.root?.serverError && (
                            <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
                        )}
                        <Button 
                            isLoading={isSubmitting}
                            isDisabled={!isValid} 
                            fullWidth 
                            color='secondary' 
                            type='submit'>
                            Register
                        </Button>
                    </div>
                </form>
            </CardBody>
        </Card>
    )
}
