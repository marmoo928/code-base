'use client'; 

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; 
import { logout } from '@/lib/auth'; // Not usable here, but handleLogout uses API

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/learn', label: 'Learn' },
  { href: '/statistics', label: 'Statistics' },
];

export default function Navbar({ user }: { user: any }) {
  const currentPath = usePathname(); 
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoggedIn = !!user;
  const userName = user?.name || "";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 grid grid-cols-2 lg:grid-cols-3 items-center py-3 sm:py-4 border-b border-neutral-800 px-4 sm:px-6 lg:px-8 bg-neutral-950/90 backdrop-blur-sm">
        
        <div className="flex items-center justify-start">
          <Link 
            href="/" 
            className="text-xl sm:text-2xl font-extrabold text-green-500 tracking-wider hover:text-green-400 transition-colors"
          >
            CODEBASE
          </Link>
        </div>

        <div className="hidden lg:flex justify-center">
          <div className="flex space-x-2 text-lg font-medium">
            {navLinks.map((link) => {
              const isActive = currentPath === link.href || (currentPath.startsWith(link.href) && link.href !== '/');

              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`
                    p-2 rounded-lg transition-all duration-200 text-center whitespace-nowrap
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
            {isLoggedIn && (
               <Link 
                href="/classes" 
                className={`
                  p-2 rounded-lg transition-all duration-200 text-center whitespace-nowrap
                  hover:bg-neutral-800 hover:text-white
                  ${currentPath.startsWith('/classes')
                    ? 'bg-neutral-800 text-green-500 font-semibold' 
                    : 'text-stone-300'
                  }
                `}
              >
                Classes
              </Link>
            )}
            {user?.role === 'TEACHER' && (
              <>
                <Link 
                  href="/tasks"
                  className={`
                    p-2 rounded-lg transition-all duration-200 text-center whitespace-nowrap
                    hover:bg-neutral-800 hover:text-white
                    ${currentPath.startsWith('/tasks')
                      ? 'bg-neutral-800 text-green-500 font-semibold' 
                      : 'text-stone-300'
                    }
                  `}
                >
                  Manage Tasks
                </Link>
                <Link 
                  href="/pathways"
                  className={`
                    p-2 rounded-lg transition-all duration-200 text-center whitespace-nowrap
                    hover:bg-neutral-800 hover:text-white
                    ${currentPath.startsWith('/pathways')
                      ? 'bg-neutral-800 text-green-500 font-semibold' 
                      : 'text-stone-300'
                    }
                  `}
                >
                  Manage Pathways
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-end space-x-4">
          {isLoggedIn ? (
            <>
              <div className="text-stone-300 text-sm">
                Hello, <span className="font-semibold text-green-400">{userName}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-neutral-800 text-red-400 rounded-lg text-sm border border-neutral-700 hover:bg-neutral-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login"
                className="text-stone-300 hover:text-white transition-colors px-3 py-2 text-sm"
              >
                Log In
              </Link>
              <Link 
                href="/register"
                className="px-4 py-2 bg-green-500 text-black rounded-lg text-sm font-semibold hover:bg-green-400 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-stone-300 hover:text-white transition-colors justify-self-end"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      <div 
        className={`
          fixed inset-0 z-40 lg:hidden transition-opacity duration-300
          ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={closeMobileMenu}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        
        <div 
          className={`
            absolute right-0 top-0 h-full w-64 bg-neutral-900 border-l border-neutral-800 
            transform transition-transform duration-300 ease-in-out flex flex-col
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
          onClick={(e) => e.stopPropagation()} 
        >
          <div className="flex justify-between items-center p-4 border-b border-neutral-800 shrink-0">
            <span className="text-lg font-bold text-green-500">Menu</span>
            <button
              onClick={closeMobileMenu}
              className="p-2 text-stone-300 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {isLoggedIn && (
            <div className="p-4 border-b border-neutral-800 shrink-0">
              <div className="text-stone-300 text-sm">
                Hello, <span className="font-semibold text-green-400">{userName}</span>
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col p-4 space-y-2 overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = currentPath === link.href || (currentPath.startsWith(link.href) && link.href !== '/');

              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`
                    p-3 rounded-lg transition-all duration-200 text-base font-medium
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
            {isLoggedIn && (
              <Link 
                href="/classes"
                onClick={closeMobileMenu}
                className={`
                  p-3 rounded-lg transition-all duration-200 text-base font-medium
                  hover:bg-neutral-800 hover:text-white
                  ${currentPath.startsWith('/classes')
                    ? 'bg-neutral-800 text-green-500 font-semibold' 
                    : 'text-stone-300'
                  }
                `}
              >
                Classes
              </Link>
            )}
            {user?.role === 'TEACHER' && (
              <>
                <Link 
                  href="/tasks"
                  onClick={closeMobileMenu}
                  className={`
                    p-3 rounded-lg transition-all duration-200 text-base font-medium
                    hover:bg-neutral-800 hover:text-white
                    ${currentPath.startsWith('/tasks')
                      ? 'bg-neutral-800 text-green-500 font-semibold' 
                      : 'text-stone-300'
                    }
                  `}
                >
                  Manage Tasks
                </Link>
                <Link 
                  href="/pathways"
                  onClick={closeMobileMenu}
                  className={`
                    p-3 rounded-lg transition-all duration-200 text-base font-medium
                    hover:bg-neutral-800 hover:text-white
                    ${currentPath.startsWith('/pathways')
                      ? 'bg-neutral-800 text-green-500 font-semibold' 
                      : 'text-stone-300'
                    }
                  `}
                >
                  Manage Pathways
                </Link>
              </>
            )}
          </div>

          <div className="p-4 border-t border-neutral-800 bg-neutral-900 shrink-0">
            {isLoggedIn ? (
              <button 
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="w-full px-4 py-3 bg-neutral-800 text-red-400 rounded-lg text-sm font-medium border border-neutral-700 hover:bg-neutral-700 transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="space-y-2">
                <Link 
                  href="/login"
                  onClick={closeMobileMenu}
                  className="block w-full px-4 py-3 text-center bg-neutral-800 text-stone-300 rounded-lg text-sm font-medium hover:bg-neutral-700 transition-colors"
                >
                  Log In
                </Link>
                <Link 
                  href="/register"
                  onClick={closeMobileMenu}
                  className="block w-full px-4 py-3 text-center bg-green-500 text-black rounded-lg text-sm font-semibold hover:bg-green-400 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}