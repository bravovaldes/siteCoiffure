import { useEffect, useState } from 'react';
import logo1 from '../assets/logo.jpg';
import logo2 from '../assets/logo1.jpg';
import logo3 from '../assets/logo2.jpg';
import logo4 from '../assets/logo3.jpg';
import logo5 from '../assets/logo4.jpg';

const images = [logo1, logo2, logo3,logo4,logo5];

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
      <div className="block md:hidden rounded-2xl overflow-hidden shadow-md">
        <img
          src={images[current]}
          alt="Salon"
          className="w-full h-[250px] object-cover transition duration-300"
        />
      </div>

      {/* Desktop : 3 images côte à côte */}
      <div className="hidden md:flex gap-4">
        {[0, 1, 2,3,4,5].map((offset) => {
          const index = (current + offset) % images.length;
          return (
            <div key={index} className="w-1/3 rounded-2xl overflow-hidden shadow-md">
              <img
                src={images[index]}
                alt={`Salon ${index}`}
                className="w-full h-[300px] object-cover transition duration-500"
              />
            </div>
          );
        })}
      </div>

      {/* Petits points d’indication */}
      <div className="flex justify-center mt-3 space-x-2">
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
