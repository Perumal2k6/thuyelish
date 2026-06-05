import { motion } from 'framer-motion'
import { Menu, X, Github, Linkedin, Mail, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { heroApi } from '../api/api'

const Navbar = ({ isAdmin, onLogin, onLogout, onNavigate, data, isDarkMode, toggleTheme }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [heroName, setHeroName] = useState("T THUYELISHWARAN")

    useEffect(() => {
        const fetchName = async () => {
            try {
                const response = await heroApi.getHeroData()
                const hero = Array.isArray(response) ? response[0] : response
                if (hero && hero.name) {
                    setHeroName(hero.name)
                }
            } catch (error) {
                // Ignore empty db fetch errors
            }
        }
        fetchName()
    }, [])

    const firstPart = heroName.slice(0, 2).toUpperCase()
    const secondPart = heroName.slice(2).toUpperCase()

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'Services', href: '#services' },
        { name: 'About', href: '#about' },
        { name: 'Skills', href: '#skills' },
        { name: 'Experience', href: '#experience' },
        { name: 'Projects', href: '#projects' },
        { name: 'Contact', href: '#contact' },
    ]

    const handleNavClick = (e, href) => {
        e.preventDefault();
        setIsOpen(false);
        if (onNavigate) onNavigate();
        setTimeout(() => {
            const element = document.getElementById(href.replace('#', ''));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                window.history.pushState(null, '', href);
            }
        }, 100);
    };

    const handleLogoClick = () => {
        if (onNavigate) onNavigate();
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            window.history.pushState(null, '', window.location.pathname);
        }, 100);
    };

    return (
        <nav className={`fixed w-full z-50 backdrop-blur-xl transition-all duration-300 ${isDarkMode ? 'bg-neutral-900/50 border-b border-white/5' : 'bg-white/70 border-b border-neutral-200/50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={handleLogoClick}
                        className="flex-shrink-0 font-black text-2xl tracking-tighter cursor-pointer group relative"
                    >
                        <span className={isDarkMode ? 'text-white' : 'text-neutral-900'}>{firstPart}</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500">{secondPart}</span>
                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-purple-600 transition-all duration-300 group-hover:w-full"></div>
                    </motion.div>

                    <div className="hidden lg:block">
                        <div className="ml-10 flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="relative group px-1 py-1"
                                >
                                    <span className={`relative z-10 transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-neutral-400 group-hover:text-white group-active:text-white' : 'text-neutral-600 group-hover:text-neutral-900 group-active:text-neutral-900'}`}>
                                        {link.name}
                                    </span>
                                    {/* Animated gradient underline */}
                                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500 transition-all duration-300 group-hover:w-full group-active:w-full rounded-full" />
                                </a>
                            ))}

                            <motion.button
                                onClick={toggleTheme}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-2.5 rounded-xl transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-neutral-800 to-neutral-900 text-yellow-400 hover:from-yellow-500 hover:to-orange-500 hover:text-white shadow-lg shadow-yellow-500/20 active:from-yellow-500 active:to-orange-500 active:text-white' : 'bg-gradient-to-br from-gray-100 to-gray-200 text-neutral-700 hover:from-purple-500 hover:to-blue-500 hover:text-white shadow-lg shadow-purple-500/20 active:from-purple-500 active:to-blue-500 active:text-white'}`}
                            >
                                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </motion.button>

                            {/* Login/Dashboard buttons completely hidden from navbar */}
                        </div>
                    </div>

                    <div className="lg:hidden flex items-center gap-4">
                        <motion.button
                            onClick={toggleTheme}
                            whileTap={{ scale: 0.9 }}
                            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-neutral-800 text-yellow-400 active:bg-neutral-700' : 'bg-gray-100 text-neutral-900 active:bg-gray-200'}`}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </motion.button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 hover:text-rose-500 active:text-rose-500 transition-colors ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`lg:hidden border-b ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}`}
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isDarkMode ? 'text-neutral-300 hover:text-white hover:bg-neutral-800 active:bg-neutral-700' : 'text-neutral-600 hover:text-black hover:bg-gray-100 active:bg-gray-200'}`}
                                onClick={(e) => handleNavClick(e, link.href)}
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                </motion.div>
            )}
        </nav>
    )
}

export default Navbar
