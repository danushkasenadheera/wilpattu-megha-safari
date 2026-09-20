import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { GallerySection } from "@/components/GallerySection";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Packages } from "@/components/Packages";
import { SectionNav } from "@/components/SectionNav";
import { Stay } from "@/components/Stay";
import { getPublicPackages } from "@/lib/packages";
import { localPhoto, resolveGallery, resolvePhotos } from "@/lib/photos";

// Refreshed instantly when the admin saves, and at least every 5 minutes as a safety net.
export const revalidate = 300;

export default async function Home() {
  const packages = await getPublicPackages();
  const photos = resolvePhotos();
  const gallery = resolveGallery();

  return (
    <>
      <Navbar />
      <SectionNav />
      <main>
        <Hero photo={photos.hero} lake={localPhoto("hero-lake")} />
        <Stay photos={photos} />
        <Packages packages={packages} photos={photos} />
        <GallerySection photos={gallery} />
        <Contact />
      </main>
      <div className="pb-24 lg:pb-0">
        <Footer />
      </div>
    </>
  );
}
