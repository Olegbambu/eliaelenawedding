import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export default function PhotoModal({ photos, index, onClose, onChange, returnFocusRef }) {
  const dialogRef = useRef(null)
  const touchStartX = useRef(null)
  const photo = photos[index]
  const step = (delta) => onChange((index + delta + photos.length) % photos.length)
  const stepRef = useRef(step)

  useEffect(() => {
    stepRef.current = step
  })

  useEffect(() => {
    const dialog = dialogRef.current
    const returnFocusTarget = returnFocusRef.current
    if (!dialog) return
    const previousOverflow = document.documentElement.style.overflow

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') stepRef.current(-1)
      if (event.key === 'ArrowRight') stepRef.current(1)
    }
    const handleCancel = (event) => {
      event.preventDefault()
      onClose()
    }

    document.documentElement.style.overflow = 'hidden'
    window.lenis?.stop()
    dialog.showModal()
    dialog.addEventListener('cancel', handleCancel)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      dialog.removeEventListener('cancel', handleCancel)
      window.removeEventListener('keydown', handleKeyDown)
      if (dialog.open) dialog.close()
      document.documentElement.style.overflow = previousOverflow
      window.lenis?.start()
      returnFocusTarget?.focus({ preventScroll: true })
    }
  }, [onClose, returnFocusRef])

  const buttonClass =
    'absolute z-10 flex size-12 items-center justify-center rounded-full bg-night-900/80 text-ink hover:bg-night-800 cursor-pointer'

  return createPortal(
    <dialog
      ref={dialogRef}
      className="photo-modal"
      aria-label={`Foto ${index + 1} di ${photos.length}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return
        const delta = event.changedTouches[0].clientX - touchStartX.current
        if (Math.abs(delta) > 50) step(delta < 0 ? 1 : -1)
        touchStartX.current = null
      }}
    >
      <img key={photo.file} src={photo.large} alt={photo.alt} className="photo-modal__image" />
      <button type="button" onClick={onClose} aria-label="Chiudi" className={`${buttonClass} top-4 right-4`}>
        <X className="size-6" aria-hidden="true" />
      </button>
      <div className="absolute inset-x-0 bottom-5 z-10 flex items-center justify-center gap-4">
        <button type="button" onClick={() => step(-1)} aria-label="Foto precedente" className={`${buttonClass} static`}>
          <ChevronLeft className="size-7" aria-hidden="true" />
        </button>
        <p className="min-w-16 text-center text-sm tabular-nums text-ink-soft" aria-live="polite">
          {index + 1} / {photos.length}
        </p>
        <button type="button" onClick={() => step(1)} aria-label="Foto successiva" className={`${buttonClass} static`}>
          <ChevronRight className="size-7" aria-hidden="true" />
        </button>
      </div>
    </dialog>,
    document.body
  )
}
