import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logop.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const links = [
    { href: "#accueil", label: "Accueil" },
    { href: "#services", label: "Services" },
    { href: "#equipe", label: "Notre équipe" },
    { href: "#temoignages", label: "Témoignages" },
    { href: "#reservation", label: "Réserver" },
    { href: "#a-propos", label: "À propos" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white fixed top-0 w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo desktop */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-10 h-10   object-cover" />
          <span className="font-bold text-[#1F60FF] text-lg">Issouf Coiffure</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-[#1F60FF] relative group"
            >
              {link.label}
              <span className="absolute left-0 bottom-[-4px] w-0 h-0.5 bg-[#1F60FF] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Mobile button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-[#1F60FF]">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-6 pt-4 pb-6 space-y-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-gray-800 hover:text-[#1F60FF]"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
