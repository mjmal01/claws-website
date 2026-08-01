import { HeroRolodexSection } from '@/components/public/HeroRolodexSection'
import { TeamPhotoSection } from '@/components/public/TeamPhotoSection'
import { NasaSuitsSection } from '@/components/public/NasaSuitsSection'
import { NasaRascalSection } from '@/components/public/NasaRascalSection'
import { GallerySection } from '@/components/public/GallerySection'
import { AlumniSection } from '@/components/public/AlumniSection'

export default function HomePage() {
  return (
    <>
      <HeroRolodexSection />
      <TeamPhotoSection />
      <NasaSuitsSection />
      <NasaRascalSection />
      <GallerySection />
      <AlumniSection />
    </>
  )
}
