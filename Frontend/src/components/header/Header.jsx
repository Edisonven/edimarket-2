import "../header/header.css";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

export function Header() {
  const images = [
    {
      original: "/imgs/aplication/banner/hero1.jpg",
      thumbnail: "/imgs/aplication/banner/hero1.jpg",
      originalHeight: 300, // Alto en píxeles
      originalWidth: 400, // Ancho en píxeles
    },
    {
      original: "/imgs/aplication/banner/hero2.jpg",
      thumbnail: "/imgs/aplication/banner/hero2.jpg",
    },
    {
      original: "/imgs/aplication/banner/hero3.jpg",
      thumbnail: "/imgs/aplication/banner/hero3.jpg",
    },
    {
      original: "/imgs/aplication/banner/hero5.jpg",
      thumbnail: "/imgs/aplication/banner/hero5.jpg",
    },
  ];

  return (
    <header className="header__container hidden md:block">
      <div className="slider__container">
        <ImageGallery
          showPlayButton={false}
          showFullscreenButton={false}
          showThumbnails={false}
          items={images}
          showBullets={true}
          autoPlay={true}
          slideInterval={5000}
          slideDuration={1000}
        />
      </div>
    </header>
  );
}
