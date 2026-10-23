import { useCallback, useLayoutEffect, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const excludedPhotoFiles = new Set([
  'constellation-desktop.png',
  'constellation-mobile.png',
  'flowers.png',
])
const photoLayouts = [
  ['rotate-3', 'self-center mt-4 md:mt-12 w-11/12'],
  ['-rotate-6', 'self-start ml-1 md:ml-4 mt-2 md:mt-8 w-11/12 md:w-10/12'],
  ['rotate-2', 'self-end mr-1 md:mr-4 mt-2 md:mt-6 w-10/12 md:w-9/12'],
  ['-rotate-3', 'self-center mt-2 md:mt-6 w-full md:w-11/12'],
  ['rotate-2', 'self-end mr-2 md:mr-6 mt-2 md:mt-6 w-9/12 md:w-8/12'],
  ['rotate-6', 'self-start ml-2 md:ml-6 mt-4 md:mt-10 w-10/12 md:w-9/12'],
  ['-rotate-2', 'self-center mt-2 md:mt-8 w-11/12 md:w-10/12'],
]
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
const albumPhotos = photoAssets.map(([path, image], index) => ({
  id: index + 1,
  image,
  title: `Foto ${index + 1}`,
  filename: path.split('/').pop(),
}))
const firstPhoto = {
  ...albumPhotos.find((photo) => photo.filename === 'SAM_7966_Original.JPG'),
  align: 'w-full',
}
const remainingPhotos = albumPhotos.slice(1)
const remainingPhotoPages = Array.from({ length: 7 }, (_, pageIndex) => {
  const start = Math.floor((pageIndex * remainingPhotos.length) / 7)
  const end = Math.floor(((pageIndex + 1) * remainingPhotos.length) / 7)
  const photos = remainingPhotos.slice(start, end)
  return photos.map((photo, index) => {
    const [rotation] = photoLayouts[(start + index) % photoLayouts.length]
    return {
      ...photo,
      rotation,
      align: photos.length === 3 ? 'w-polaroid-triple md:w-1/2' : 'w-polaroid md:w-9/12',
      compact: true,
    }
  })
})
const finalPhotoPage = remainingPhotoPages[6]
const finalPhotoSplitIndex = Math.ceil(finalPhotoPage.length / 2)
const finalPhotoBack = finalPhotoPage.slice(finalPhotoSplitIndex)
const finalPhotoBackLayout = finalPhotoBack.length === 1
  ? finalPhotoBack.map((photo) => ({
      ...photo,
      rotation: '',
      align: 'w-full',
      compact: false,
    }))
  : finalPhotoBack
const remainingPhotoSheets = Array.from({ length: 3 }, (_, index) => ({
  id: `sheet-${index + 2}`,
  front: remainingPhotoPages[index * 2],
  back: remainingPhotoPages[index * 2 + 1],
}))
const albumSheets = [
  {
    id: 'sheet-1',
    isCover: true,
    firstPhoto,
  },
  ...remainingPhotoSheets,
  {
    id: 'sheet-5',
    front: finalPhotoPage.slice(0, finalPhotoSplitIndex),
    back: finalPhotoBackLayout,
  },
  {
    id: 'sheet-6',
    isFinalPage: true,
  },
]

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
  const bookRef = useRef(null)
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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const pages = gsap.utils.toArray('.book__page')
      const totalPages = pages.length

      pages.forEach((page) => {
        gsap.set(page, {
          rotateY: 0,
        })
      })

      gsap.set(bookRef.current, { xPercent: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${(totalPages - 1) * 100}%`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      tl.to(
        bookRef.current,
        {
          xPercent: 50,
          ease: 'power1.inOut',
          duration: 1,
        },
        0
      )

      pages.forEach((page, i) => {
        if (i === totalPages - 1) return

        tl.to(
          page,
          {
            rotateY: -180,
            ease: 'power1.inOut',
            duration: 1,
          },
          i
        )

        tl.set(page, { zIndex: i }, i + 0.5)
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const renderPhoto = (item) => (
    <button
      key={item.id}
      type="button"
      data-photo-id={item.id}
      aria-label={`Apri ${item.title}`}
      className={`photo-card relative block cursor-pointer rounded-sm border border-slate-200/85 bg-white ${item.compact ? 'p-0.5 pb-1 md:p-1 md:pb-2' : 'p-1.5 pb-4 md:p-4 md:pb-8'} shadow-md transition-all duration-300 hover:z-50 hover:scale-105 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${item.rotation || ''} ${item.align || ''} group`}
    >
      <div className="pointer-events-none absolute -top-2 left-1/2 z-10 h-4 w-10 -translate-x-1/2 rotate-2 bg-album-tape/70 shadow-sm md:h-6 md:w-16" />
      <div className="aspect-4/3 w-full overflow-hidden rounded-sm border border-slate-100 bg-slate-900">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="block h-full w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </button>
  )

  return (
    <section
      ref={sectionRef}
      id="story"
      className="min-h-screen w-full text-star-white flex flex-col items-center justify-center relative overflow-hidden select-none"
    >
      <div className="book-wrapper">
        <div ref={bookRef} className="book">
          <div className="book__spine" />
          <div className="book__insert" />

          {albumSheets.map((sheet, index) => {
            const zIndex = albumSheets.length + 10 - index;
            return (
              <div key={sheet.id} className="book__page" style={{ zIndex }}>
                <div className={`page__half page__half--front ${sheet.isCover ? 'cover-page p-3 md:p-10 items-center justify-center' : 'paper-page p-2 md:p-8 flex-col justify-start'}`}>
                  {sheet.isCover ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-md border border-album-border/60 bg-linear-to-b from-album-highlight via-album-cover to-album-pink/30 p-3 text-center shadow-lg md:gap-8 md:p-6">
                      <span className="text-3xs font-bold uppercase tracking-album text-album-label md:text-sm">
                        Il nostro album
                      </span>
                      <h3 className="font-heading text-4xl font-semibold text-album-ink md:text-7xl">
                        Elia e Elena
                      </h3>
                      <span className="text-xs text-album-label md:text-sm">
                        Clicca sulla foto per ingrandire
                      </span>
                    </div>
                  ) : sheet.isFinalPage ? (
                    <div className="flex h-full w-full items-center justify-center text-center cover-page">
                      <span className="font-heading text-2xl text-album-label md:text-7xl">Continua...</span>
                    </div>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1 overflow-hidden p-1 md:gap-2 md:p-3">
                       {sheet.front?.map(photo => renderPhoto(photo))}
                    </div>
                  )}
                </div>

                <div className={`page__half page__half--back ${sheet.isCover ? 'bg-album-cover p-3 md:p-6 border-r border-album-border/40 items-center justify-center text-center' : 'paper-page p-2 md:p-8 flex-col justify-start border-r border-slate-200/80'}`}>
                  {sheet.isFinalPage ? (
                    null
                  ) : sheet.isCover ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-3 overflow-y-auto p-2 text-center md:gap-6 md:p-6" style={{ scrollbarWidth: 'none' }}>
                      <h3 className="font-heading text-xl text-album-ink md:text-4xl">
                        La nostra prima foto
                      </h3>
                      {renderPhoto(sheet.firstPhoto)}
                    </div>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1 overflow-hidden p-1 md:gap-2 md:p-3">
                      {sheet.back?.map(photo => renderPhoto(photo))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selectedPhoto && <PhotoModal photo={selectedPhoto} onClose={closePhoto} />}
    </section>
  )
}
