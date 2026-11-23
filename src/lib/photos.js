// Every photo in src/assets, resized to WebP at build time by vite-imagetools.
const thumbs = import.meta.glob('../assets/*.{jpg,jpeg,JPG}', {
  eager: true,
  query: { w: '400;800', format: 'webp', as: 'srcset' },
  import: 'default',
})
const smalls = import.meta.glob('../assets/*.{jpg,jpeg,JPG}', {
  eager: true,
  query: { w: '800', format: 'webp' },
  import: 'default',
})
const larges = import.meta.glob('../assets/*.{jpg,jpeg,JPG}', {
  eager: true,
  query: { w: '1600', format: 'webp' },
  import: 'default',
})

const fileName = (path) => path.split('/').pop()

export const photos = Object.keys(thumbs)
  .map((path) => ({
    file: fileName(path),
    srcSet: thumbs[path],
    src: smalls[path],
    large: larges[path],
  }))
  .sort((a, b) => {
    if (a.file === 'SAM_7966_Original.JPG') return -1
    if (b.file === 'SAM_7966_Original.JPG') return 1
    return a.file.localeCompare(b.file, undefined, { numeric: true })
  })

const byFile = new Map(photos.map((photo) => [photo.file, photo]))

export const getPhoto = (file) => byFile.get(file)
