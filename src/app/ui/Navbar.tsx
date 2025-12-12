'use client'; 

import { useState } from 'react';
import Link from 'next/link'; // Use Link from next/link for client-side navigation
import { usePathname } from 'next/navigation'; 


const navLinks = [ // Moved outside the component to prevent re-creation on every render
  { href: '/', label: 'Home' },
  { href: '/learn', label: 'Learn' },
  { href: '/stats', label: 'Statistics' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
];

export default function Navbar() { // Removed unused 'children' prop
  const currentPath = usePathname(); 
  
  // These states should ideally be managed by an auth context/hook in a real app
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  const userName = "Coder47";

  return (
    <nav 
      className="sticky top-0 z-50 flex justify-between items-center py-4 border-b border-neutral-800 px-8 bg-neutral-950/90 backdrop-blur-sm"
      // Added sticky, z-50, and background/backdrop-blur for a common modern navbar effect
    >
      <div className="flex items-center">
        <Link 
          href="/" 
          className="text-2xl font-extrabold text-green-500 tracking-wider hover:text-green-400 transition-colors"
        >
          CODEBASE
        </Link>
      </div>
      <div className="hidden lg:flex flex-grow justify-center">
        <div className="flex space-x-2 text-lg font-medium">
          {navLinks.map((link) => {
            // Check if the current path starts with the link's href for better active state on nested routes
            const isActive = currentPath === link.href || (currentPath.startsWith(link.href) && link.href !== '/');

            return (
              // Use Next.js <Link> component instead of <a> for faster client-side routing
              <Link 
                key={link.href}
                href={link.href} 
                className={`
                  p-2 rounded-lg transition-all duration-200 
                  hover:bg-neutral-800 hover:text-white
                  ${isActive 
                    ? 'bg-neutral-800 text-green-500 font-semibold' 
                    : 'text-stone-300'
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <div className="hidden sm:block text-stone-300 text-sm">
              Hello, <span className="font-semibold text-green-400">{userName}</span>
            </div>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="px-4 py-2 bg-neutral-800 text-red-400 rounded-lg text-sm border border-neutral-700 hover:bg-neutral-700 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              href="/login" // Assuming you have a login page
              onClick={() => setIsLoggedIn(true)} // This is just for local testing, remove in real app
              className="text-stone-300 hover:text-white transition-colors px-3 py-2 text-sm"
            >
              Log In
            </Link>
            <Link 
              href="/register" // Assuming you have a register page
              className="px-4 py-2 bg-green-500 text-black rounded-lg text-sm font-semibold hover:bg-green-400 transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};