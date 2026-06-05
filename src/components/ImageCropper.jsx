import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Check, X, ZoomIn, ZoomOut } from 'lucide-react'

// Helper to convert cropped area to File
const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await new Promise((resolve, reject) => {
        const img = new Image()
        img.addEventListener('load', () => resolve(img))
        img.addEventListener('error', (err) => reject(err))
        img.src = imageSrc
    })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // set canvas size to match the cropped area
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // draw image
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    )

    // return as File
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], 'cropped_image.webp', { type: 'image/webp' })
                resolve(file)
            } else {
                resolve(null)
            }
        }, 'image/webp')
    })
}

export default function ImageCropper({ imageSrc, onComplete, onCancel, aspect = 1 }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return
        setIsProcessing(true)
        try {
            const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels)
            onComplete(croppedFile)
        } catch (error) {
            console.error(error)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-neutral-900 rounded-[30px] w-full max-w-xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
                    <h3 className="text-white font-black uppercase tracking-widest text-sm">Crop Image</h3>
                    <button onClick={onCancel} className="text-neutral-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="relative h-[60vh] w-full bg-black">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>

                <div className="p-6 bg-neutral-900 space-y-6">
                    <div className="flex items-center gap-4">
                        <ZoomOut size={16} className="text-neutral-500" />
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(e.target.value)}
                            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                        <ZoomIn size={16} className="text-neutral-500" />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                        <button
                            onClick={onCancel}
                            disabled={isProcessing}
                            className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isProcessing}
                            className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-white bg-rose-600 hover:bg-rose-500 transition-colors flex items-center gap-2"
                        >
                            {isProcessing ? 'Cropping...' : <><Check size={16} /> Confirm</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
