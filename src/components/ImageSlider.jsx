import { useEffect, useState } from 'react';
import logo5 from '../assets/logo1.jpg';
import logo2 from '../assets/logo8.png';
import logo3 from '../assets/logo2.jpg';
import logo4 from '../assets/logo3.jpg';
import logo1 from '../assets/logo4.jpg';
import logo6 from '../assets/logo.jpg';
import logo7 from '../assets/logo6.jpg';
import logo8 from '../assets/logo7.jpg';

const images = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8];

export default function ImageSlider() {
  const groupSize = 3;
  const totalGroups = Math.ceil(images.length / groupSize);

  const [currentMobile, setCurrentMobile] = useState(0);
  const [currentDesktopGroup, setCurrentDesktopGroup] = useState(0);

  // Slider pour mobile (1 image à la fois)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMobile((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Slider pour desktop (3 images à la fois)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDesktopGroup((prev) => (prev + 1) % totalGroups);
    }, 4000);
    return () => clearInterval(interval);
  }, [totalGroups]);

  const getCurrentGroup = () => {
    const start = currentDesktopGroup * groupSize;
    return images.slice(start, start + groupSize);
  };

  return (
    <div className="w-full px-0">
      {/* Mobile : une seule image */}
      <div className="block md:hidden rounded-2xl overflow-hidden shadow-md">
        <img
          src={images[currentMobile]}
          alt="Salon"
          className="w-full h-[250px] object-cover transition duration-300"
        />
      </div>

      {/* Desktop : 3 images */}
      <div className="hidden md:flex gap-4">
        {getCurrentGroup().map((img, i) => (
          <div key={i} className="w-1/3 rounded-2xl overflow-hidden shadow-md">
            <img
              src={img}
              alt={`Salon ${i}`}
              className="w-full h-[300px] object-cover transition duration-500"
            />
          </div>
        ))}
      </div>

      {/* Petits points d’indication (desktop uniquement) */}
      <div className="hidden md:flex justify-center mt-3 space-x-2">
        {Array.from({ length: totalGroups }).map((_, index) => (
          <span
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentDesktopGroup ? 'bg-[#1F60FF]' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Petits points d’indication (mobile uniquement) */}
      <div className="flex md:hidden justify-center mt-3 space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentMobile ? 'bg-[#1F60FF]' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
