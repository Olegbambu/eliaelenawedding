import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const excludedPhotoFiles = new Set([
  'constellation-desktop.png',
  'constellation-mobile.png',
  'flowers.png',
])
const photoAssets = Object.entries(
  import.meta.glob('../assets/*', { eager: true, query: '?url', import: 'default' })
)
  .filter(([path]) => {
    const filename = path.split('/').pop()
    return /\.(jpe?g|png|webp|avif|gif|heic|heif|tiff?)$/i.test(filename)
      && !excludedPhotoFiles.has(filename)
  })
  .sort(([pathA], [pathB]) => {
    const filenameA = pathA.split('/').pop()
    const filenameB = pathB.split('/').pop()
    if (filenameA === 'SAM_7966_Original.JPG') return -1
    if (filenameB === 'SAM_7966_Original.JPG') return 1
    return filenameA.localeCompare(filenameB, undefined, { numeric: true })
  })
const albumPhotos = photoAssets.map(([, image], index) => ({
  id: index + 1,
  image,
  title: `Foto ${index + 1}`,
}))
const photosPerGarland = 2
const photoGarlands = Array.from(
  { length: Math.ceil(albumPhotos.length / photosPerGarland) },
  (_, index) => albumPhotos.slice(index * photosPerGarland, (index + 1) * photosPerGarland)
)

function PhotoModal({ photo, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    const previousDocumentOverflow = document.documentElement.style.overflow
    const dialog = dialogRef.current
    if (!dialog) return
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    window.lenis?.stop()
    dialog.showModal()

    const handleCancel = (event) => {
      event.preventDefault()
      onClose()
    }
    dialog.addEventListener('cancel', handleCancel)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      dialog.removeEventListener('cancel', handleCancel)
      window.removeEventListener('keydown', handleKeyDown)
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousDocumentOverflow
      window.lenis?.start()
    }
  }, [onClose])

  return createPortal(
    <dialog
      ref={dialogRef}
      className="photo-modal"
      aria-label={`Foto ingrandita: ${photo.title}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Chiudi foto"
        className="absolute right-4 top-4 z-10 rounded-full bg-black/60 px-4 py-2 text-sm font-semibold text-white hover:bg-black/80"
      >
        Chiudi ✕
      </button>
      <img
        src={photo.image}
        alt={photo.title}
        className="photo-modal__image"
      />
    </dialog>,
    document.body
  )
}

export default function Story() {
  const sectionRef = useRef(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const closePhoto = useCallback(() => setSelectedPhoto(null), [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const handlePhotoClick = (event) => {
      if (!(event.target instanceof Element)) return
      const photoButton = event.target.closest('[data-photo-id]')
      if (!photoButton) return

      const photo = albumPhotos.find((item) => item.id === Number(photoButton.dataset.photoId))
      if (photo) setSelectedPhoto(photo)
    }

    section.addEventListener('click', handlePhotoClick)
    return () => section.removeEventListener('click', handlePhotoClick)
  }, [])

  const renderPhoto = (item) => (
    <button
      key={item.id}
      type="button"
      data-photo-id={item.id}
      aria-label={`Ingrandisci ${item.title}`}
      className="photo-garland__photo group"
    >
      <span className="photo-garland__bulb" aria-hidden="true" />
      <span className="photo-garland__cord" aria-hidden="true" />
      <span className="photo-garland__frame">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      </span>
    </button>
  )

  return (
    <section
      ref={sectionRef}
      id="story"
      className="photo-story relative flex min-h-screen w-full flex-col items-center px-4 py-20 text-star-white"
    >
      <div className="w-full max-w-6xl">
        <header className="mb-12 text-center md:mb-16">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-star-white/80">
            I nostri ricordi
          </p>
          <h2 className="font-heading text-5xl text-star-white md:text-7xl">
            Il nostro album
          </h2>
          <p className="mt-3 text-base text-star-white/90 md:text-lg">
            Piccoli momenti appesi alla nostra storia. Tocca una foto per ingrandirla.
          </p>
        </header>
        <div className="photo-garlands">
          {photoGarlands.map((garland, index) => (
            <div
              key={`garland-${index + 1}`}
              className="photo-garland"
              role="group"
              aria-label={`Filo di foto ${index + 1}`}
            >
              {garland.map(renderPhoto)}
            </div>
          ))}
        </div>
      </div>
      {selectedPhoto && <PhotoModal photo={selectedPhoto} onClose={closePhoto} />}
    </section>
  )
}
