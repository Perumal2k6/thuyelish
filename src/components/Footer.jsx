import { Github, Linkedin, Twitter, Instagram, Heart, ArrowUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { heroApi } from '../api/api'
import { motion } from 'framer-motion'

const Footer = () => {
    const [heroName, setHeroName] = useState("T THUYELISHWARAN")
    const [showScrollTop, setShowScrollTop] = useState(false)

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

        // Scroll to top button visibility
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const nameStr = heroName || "T THUYELISHWARAN"
    const parts = nameStr.split(' ')
    const firstPart = parts.length > 1 ? parts[0].toUpperCase() : nameStr.split(' ')[0] || nameStr.slice(0, 1).toUpperCase()
    const secondPart = parts.length > 1 ? parts.slice(1).join(' ').toUpperCase() : nameStr.slice(firstPart.length).toUpperCase()

    return (
        <>
            <footer className="relative py-12 px-6 bg-neutral-950 border-t border-white/5 overflow-hidden">
                {/* Decorative gradient blobs */}
                <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-gradient-to-br from-rose-500/5 via-purple-500/5 to-cyan-500/5 blur-[120px] rounded-full -z-10" />

                <div className="max-w-7xl mx-auto">
                    {/* Single Row Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start lg:items-center mb-8">

                        {/* Brand Section - Left */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-3"
                        >
                            <div className="mb-4">
                                <span className="text-2xl md:text-3xl font-black tracking-tighter">
                                    <span className="text-white">{firstPart} </span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500">{secondPart}</span>
                                </span>
                            </div>
                            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
                                Building digital experiences that inspire and innovate. Let's create something amazing together.
                            </p>
                        </motion.div>

                        {/* Quick Links - Center */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="lg:justify-self-center"
                        >
                            <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-4">Quick Links</h3>
                            <div className="flex flex-col gap-2">
                                {[
                                    { name: 'Home', href: '#home' },
                                    { name: 'About', href: '#about' },
                                    { name: 'Projects', href: '#projects' },
                                    { name: 'Contact', href: '#contact' }
                                ].map((link, idx) => (
                                    <a
                                        key={idx}
                                        href={link.href}
                                        className="text-neutral-400 hover:text-white active:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 active:translate-x-1 inline-block group w-fit"
                                    >
                                        <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:to-purple-500 group-active:text-transparent group-active:bg-clip-text group-active:bg-gradient-to-r group-active:from-rose-500 group-active:to-purple-500">
                                            {link.name}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Connect Section - Right */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="lg:justify-self-end"
                        >
                            <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-4">Connect</h3>
                            <div className="flex gap-3">
                                {[
                                    { Icon: Github, url: 'https://github.com/thuyelish', name: 'GitHub' },
                                    { Icon: Linkedin, url: 'www.linkedin.com/in/thuyelish-t-a7362a32b/', name: 'LinkedIn' },
                                    { Icon: Twitter, url: '', name: 'Twitter' },
                                    { Icon: Instagram, url: 'https://www.instagram.com/thuyel_cr?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', name: 'Instagram' }
                                ].map(({ Icon, url, name }, idx) => (
                                    <motion.a
                                        key={idx}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.15, y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white active:text-white border border-white/5 hover:border-white/20 active:border-white/20 transition-all duration-300 hover:bg-gradient-to-br hover:from-rose-500/20 hover:to-purple-500/20 active:bg-gradient-to-br active:from-rose-500/20 active:to-purple-500/20"
                                        aria-label={name}
                                    >
                                        <Icon size={18} />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent my-6" />

                    {/* Bottom Section - Single Line */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left"
                    >
                        <p className="text-neutral-500 text-xs md:text-sm flex items-center gap-2 flex-wrap justify-center md:justify-start">
                            <span>© 2026 All rights reserved.</span>
                            <span className="hidden md:inline text-neutral-700">•</span>
                            <span className="flex items-center gap-1.5">
                                Made with <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" /> by <span className="text-white font-semibold">{heroName || 'T THUYELISHWARAN'}</span>
                            </span>
                        </p>
                        <div className="flex items-center gap-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            <a href="#home" className="hover:text-white active:text-white transition-colors hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-rose-500 hover:to-purple-500 active:text-transparent active:bg-clip-text active:bg-gradient-to-r active:from-rose-500 active:to-purple-500">
                                Privacy
                            </a>
                            <span className="text-neutral-700">•</span>
                            <a href="#home" className="hover:text-white active:text-white transition-colors hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-rose-500 hover:to-purple-500 active:text-transparent active:bg-clip-text active:bg-gradient-to-r active:from-rose-500 active:to-purple-500">
                                Terms
                            </a>
                        </div>
                    </motion.div>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-rose-500/50 hover:shadow-rose-500/70 transition-all duration-300 border border-white/20"
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={24} strokeWidth={2.5} />
                </motion.button>
            )}
        </>
    )
}

export default Footer
