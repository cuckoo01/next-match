'use client'

import { createMessage } from '@/app/(auth)/actions/messageActions'
import { MessageSchema, messageSchema } from '@/lib/schemas/messageSchema'
import { handleFormServerErrors } from '@/lib/util'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { HiPaperAirplane } from 'react-icons/hi2'

export default function ChatForm() {
    const params = useParams<{ userId: string }>();
    const { register, handleSubmit, reset, setError, setFocus, formState: { isSubmitting, isValid, errors } } = useForm<MessageSchema>({
        resolver: zodResolver(messageSchema)
    })

    const onSubmit = async (data: MessageSchema) => {
        const result = await createMessage(params.userId, data);
        if (result.status === 'error') {
            handleFormServerErrors(result, setError)
        } else {
            reset(); // clear the text in the chat input
            window.location.reload()
            setTimeout(() => {
                setFocus('text')
            }, 50)
        }
    }

    useEffect(() => {
        setFocus('text');
    }, [setFocus])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full flex items-center gap-2'>
            <div className='flex items-center gap-2 w-full'>
                <Input
                    fullWidth
                    placeholder='Type a message'
                    variant='faded'
                    {...register('text')}
                    isInvalid={!!errors.text}
                    errorMessage={errors.text?.message}
                />
                <Button
                    type='submit'
                    isIconOnly
                    color='secondary'
                    radius='full'
                    isLoading={isSubmitting}
                    isDisabled={!isValid || isSubmitting}
                >
                    <HiPaperAirplane size={18} />
                </Button>
            </div>
            <div className='flex flex-col'>
                {true && errors.root?.serverError && (
                    <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
                )}
            </div>
        </form>
    )
}
