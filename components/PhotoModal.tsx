import { motion, PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, Download, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface Photo {
    name: string
    url: string
}

interface PhotoModalProps {
    photo: Photo
    onClose: () => void
    onNext: () => void
    onPrevious: () => void
    modalDragY: number
    setModalDragY: (y: number) => void
    hasNext: boolean
    hasPrevious: boolean
    currentIndex: number
    totalPhotos: number
    isDownloading: boolean
    onDownload: (photo: Photo) => void
}

export function PhotoModal({
    photo,
    onClose,
    onNext,
    onPrevious,
    modalDragY,
    setModalDragY,
    hasNext,
    hasPrevious,
    currentIndex,
    totalPhotos,
    isDownloading,
    onDownload,
}: PhotoModalProps) {
    const [isImageLoading, setIsImageLoading] = useState(true)

    console.log("I am loaded")
    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' && hasNext) onNext()
            if (e.key === 'ArrowLeft' && hasPrevious) onPrevious()
            if (e.key === 'Escape') onClose()
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [hasNext, hasPrevious, onNext, onPrevious, onClose])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center touch-none"
            onClick={onClose}
        >
            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDrag={(_, info: PanInfo) => setModalDragY(info.offset.y)}
                onDragEnd={(_, info: PanInfo) => {
                    if (Math.abs(info.offset.y) > 100) {
                        onClose()
                    }
                    setModalDragY(0)
                }}
                animate={{
                    y: modalDragY,
                    opacity: 1 - Math.abs(modalDragY) / 500,
                }}
                className="relative w-full h-full flex items-center justify-center p-4"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                    title="Close"
                >
                    <X size={24} />
                </button>

                {/* Navigation buttons */}
                {hasPrevious && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onPrevious()
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                        title="Previous photo"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}
                {hasNext && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onNext()
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                        title="Next photo"
                    >
                        <ChevronRight size={24} />
                    </button>
                )}

                <div className="relative w-[90vw] h-[80vh]">
                    <motion.div
                        key={photo.url}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={photo.url}
                            alt={photo.name}
                            fill
                            className="object-contain"
                            sizes="90vw"
                            priority
                            onLoadingComplete={() => setIsImageLoading(false)}
                        />
                    </motion.div>
                    {(isImageLoading || isDownloading) && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader2 className="w-12 h-12 animate-spin" />
                        </div>
                    )}
                </div>

                {/* Photo info and controls */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white text-lg font-medium mb-1">
                                {photo.name}
                            </h3>
                            <p className="text-white/70 text-sm">
                                {currentIndex + 1} of {totalPhotos}
                            </p>
                        </div>
                        <button
                            onClick={() => onDownload(photo)}
                            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Download photo"
                            disabled={isDownloading}
                        >
                            {isDownloading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <Download size={24} />
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
} 