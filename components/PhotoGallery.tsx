import { AnimatePresence } from 'framer-motion'
import { Download, Grid, LayoutGrid, List, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { PhotoModal } from './PhotoModal'

interface Photo {
    name: string
    url: string
}

type ViewMode = 'grid' | 'tiles' | 'list'

interface PhotoGalleryProps {
    photos: Photo[]
    isLoading: boolean
}

export function PhotoGallery({ photos, isLoading }: PhotoGalleryProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

    console.log("selected photo: ", selectedPhoto)
    const [modalDragY, setModalDragY] = useState(0)
    const [downloadingPhoto, setDownloadingPhoto] = useState<string | null>(null)

    const currentPhotoIndex = selectedPhoto ? photos.findIndex(p => p.name === selectedPhoto.name) : -1

    const showNextPhoto = () => {
        if (currentPhotoIndex < photos.length - 1) {
            setSelectedPhoto(photos[currentPhotoIndex + 1])
        }
    }

    const showPreviousPhoto = () => {
        if (currentPhotoIndex > 0) {
            setSelectedPhoto(photos[currentPhotoIndex - 1])
        }
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedPhoto) {
                if (e.key === 'ArrowRight') showNextPhoto()
                if (e.key === 'ArrowLeft') showPreviousPhoto()
                if (e.key === 'Escape') setSelectedPhoto(null)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedPhoto, currentPhotoIndex]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleDownload = async (photo: Photo) => {
        try {
            setDownloadingPhoto(photo.name)
            const response = await fetch(photo.url)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `${photo.name}.jpg`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error downloading photo:', error)
        } finally {
            setDownloadingPhoto(null)
        }
    }

    const getGridClassName = () => {
        switch (viewMode) {
            case 'grid':
                return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            case 'tiles':
                return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4'
            case 'list':
                return 'flex flex-col space-y-4'
            default:
                return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        }
    }

    const getPhotoClassName = () => {
        switch (viewMode) {
            case 'grid':
                return 'aspect-square'
            case 'tiles':
                return 'h-full w-full'
            case 'list':
                return 'h-48 w-full md:h-64'
            default:
                return 'aspect-square'
        }
    }

    if (isLoading) {
        return (
            <div className={getGridClassName()}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className={`${getPhotoClassName()} bg-zinc-800 rounded-lg animate-pulse`}
                    />
                ))}
            </div>
        )
    }

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Gallery</h2>
                <div className="flex items-center space-x-2 bg-zinc-800 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-zinc-700' : 'hover:bg-zinc-700/50'
                            }`}
                        title="Grid view"
                    >
                        <Grid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('tiles')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'tiles' ? 'bg-zinc-700' : 'hover:bg-zinc-700/50'
                            }`}
                        title="Tiles view"
                    >
                        <LayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-zinc-700' : 'hover:bg-zinc-700/50'
                            }`}
                        title="List view"
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            <div className={getGridClassName()}>
                {photos.map((photo) => (
                    <div
                        key={photo.name}
                        className={`${getPhotoClassName()} bg-zinc-800 rounded-lg relative overflow-hidden group hover:ring-2 hover:ring-white/50 transition-all duration-300`}
                        onClick={() => setSelectedPhoto(photo)}
                    >
                        <Image
                            src={photo.url}
                            alt={photo.name}
                            fill
                            className="object-cover cursor-pointer"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

                        />
                        {downloadingPhoto === photo.name && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                <h3 className="text-white text-lg font-medium truncate">
                                    {photo.name}
                                </h3>
                                <button
                                    onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation()
                                        handleDownload(photo)
                                    }}
                                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Download photo"
                                    disabled={downloadingPhoto === photo.name}
                                >
                                    {downloadingPhoto === photo.name ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Download size={20} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {selectedPhoto && (
                    <PhotoModal
                        photo={selectedPhoto}
                        onClose={() => setSelectedPhoto(null)}
                        onNext={showNextPhoto}
                        onPrevious={showPreviousPhoto}
                        modalDragY={modalDragY}
                        setModalDragY={setModalDragY}
                        hasNext={currentPhotoIndex < photos.length - 1}
                        hasPrevious={currentPhotoIndex > 0}
                        currentIndex={currentPhotoIndex}
                        totalPhotos={photos.length}
                        isDownloading={downloadingPhoto === selectedPhoto.name}
                        onDownload={handleDownload}
                    />
                )}
            </AnimatePresence>
        </>
    )
} 