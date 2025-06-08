import { useEffect, useState } from 'react';
import logo1 from '../assets/logo.jpg';
import logo2 from '../assets/logo.jpg';
import logo3 from '../assets/logo.jpg';

const images = [logo1, logo2, logo3];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // Change toutes les 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Mobile : une image */}
      <div className="block md:hidden">
        <img
        src={images[current]}
        alt="Salon"
        className="w-full h-[250px] md:h-[400px] object-cover transition duration-300"
        />

      </div>

      {/* Desktop : 3 images côte à côte */}
      <div className="hidden md:flex gap-4">
        {[0, 1, 2].map((offset) => {
          const index = (current + offset) % images.length;
          return (
            <img
              key={index}
              src={images[index]}
              alt={`Salon ${index}`}
              className="w-1/3 h-[300px] object-cover transition duration-500"
            />
          );
        })}
      </div>

      {/* Petits points d’indication */}
      <div className="flex justify-center mt-2 space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === current ? 'bg-[#1F60FF]' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
