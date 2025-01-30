import React from 'react'
import { CldUploadButton, CloudinaryUploadWidgetResults } from 'next-cloudinary'
import { HiPhoto } from 'react-icons/hi2'

type Props = {
    onUploadImage: (result: CloudinaryUploadWidgetResults) => void // data type for a function
}

// after uploading image onto Cloudinary -> calling onUploadImage to save image_url to db
export default function ImageUploadButton({ onUploadImage }: Props) {
    return (
        <CldUploadButton
            options={{ maxFiles: 1 }}
            onSuccess={onUploadImage}   // is onUploadImage a callback function?
            signatureEndpoint='/api/sign-image'
            uploadPreset='nm-demo'
            className={`flex items-center gap-2 border-2 border-secondary 
                text-secondary-50 rounded-lg py-2 px-4 hover:bg-secondary/10`}
        >
            <HiPhoto size={28} />
            Upload new image
        </CldUploadButton>
    )
}

// S1: making a POST request to /api/sign-image to "upload image to Cloudinary"
// S2: then, call onUploadImage(response) to save image_url to db
