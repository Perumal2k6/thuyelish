import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Instagram, Download } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { heroApi } from '../api/api'


const Hero = ({ isDarkMode }) => {
    const [heroData, setHeroData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0)
    const [displayText, setDisplayText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    const roles = ["Full Stack Developer", "Frontend Developer", "Backend Developer", "UI/UX Designer", "Web Developer", "Application Developer", "React Developer", "Python Developer"]

    // --- Typing Animation Logic ---
    useEffect(() => {
        let timeout;
        const currentRole = roles[currentRoleIndex];

        if (isDeleting) {
            timeout = setTimeout(() => {
                setDisplayText(currentRole.substring(0, displayText.length - 1));
                if (displayText.length <= 1) {
                    setIsDeleting(false);
                    setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
                }
            }, 50);
        } else {
            timeout = setTimeout(() => {
                setDisplayText(currentRole.substring(0, displayText.length + 1));
                if (displayText.length === currentRole.length) {
                    timeout = setTimeout(() => {
                        setIsDeleting(true);
                    }, 3000);
                }
            }, 120);
        }
        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentRoleIndex])

    useEffect(() => {
        const fetchHero = async () => {
            try {
                const response = await heroApi.getHeroData()
                setHeroData(Array.isArray(response) ? response[0] : response)
            } catch (error) {
                if (error.message && (error.message.toLowerCase().includes('not found') || error.message.includes('404'))) {
                    console.log("No hero data found in database yet. Ready to create one.");
                    setHeroData(null);
                } else {
                    console.error("Error fetching hero data:", error)
                    toast.error("Failed to load hero section.")
                }
            } finally {
                setIsLoading(false)
            }
        }
        fetchHero()
    }, [])

    const handleResumeClick = () => {
        if (!heroData?.resume_url) {
            toast.info("No resume uploaded yet.");
            return;
        }

        try {
            if (heroData.resume_url.startsWith('data:')) {
                const arr = heroData.resume_url.split(',');
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);

                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }

                const blob = new Blob([u8arr], { type: mime });
                const blobUrl = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = `${heroData.name.replace(/\s+/g, '_')}_Resume.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);
            } else {
                window.open(heroData.resume_url, '_blank', 'noopener,noreferrer');
            }
        } catch (error) {
            console.error("Error opening resume:", error);
            toast.error("Failed to open resume file.");
        }
    };

    if (isLoading) {
        return (
            <section id="home" className="min-h-screen pt-32 pb-20 px-4 flex justify-center items-center">
                <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            </section>
        )
    }

    const activeHero = heroData || {
        name: "Welcome Admin",
        title: "Setup Your Profile",
        bio: "Login to the dashboard to setup your profile, upload your resume, and save it to the database!",
        profile_image: "https://placehold.co/400x400",
        resume_url: null
    };

    return (
        <section id="home" className="min-h-screen pt-32 pb-20 px-4 flex items-center bg-transparent overflow-hidden relative">
            {/* Modern Gradient Mesh Background */}
            <div className={`absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] blur-[150px] rounded-full -z-10 ${isDarkMode ? 'bg-gradient-to-br from-rose-500/20 via-purple-500/20 to-cyan-500/20' : 'bg-gradient-to-br from-rose-400/10 via-purple-400/10 to-cyan-400/10'}`} />
            <div className={`absolute bottom-1/4 right-1/4 w-[400px] h-[400px] blur-[120px] rounded-full -z-10 ${isDarkMode ? 'bg-gradient-to-tr from-purple-500/15 to-cyan-500/15' : 'bg-gradient-to-tr from-purple-400/8 to-cyan-400/8'}`} />

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative order-2 md:order-1 flex justify-center md:justify-start"
                >
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-full aspect-square max-w-[400px] flex items-center justify-center"
                    >
                        {/* Enhanced glow effect */}
                        <div className={`absolute inset-0 rounded-full blur-[120px] opacity-60 z-0 ${isDarkMode ? 'bg-gradient-to-br from-rose-500 via-purple-600 to-cyan-500' : 'bg-gradient-to-br from-rose-300 via-purple-400 to-cyan-300'}`} />
                        
                        {/* Animated gradient ring */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-2 rounded-full bg-gradient-to-tr from-rose-500 via-purple-600 via-cyan-500 to-rose-500 z-0 blur-md opacity-90"
                            style={{ backgroundSize: '200% 200%' }}
                        />
                        
                        {/* Orbiting dots - Multiple balls circling */}
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-6 rounded-full z-0"
                        >
                            {/* Top */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 shadow-lg shadow-rose-500/50"></div>
                            {/* Top Right */}
                            <div className="absolute top-[15%] right-[15%] w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50"></div>
                            {/* Right */}
                            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50"></div>
                            {/* Bottom Right */}
                            <div className="absolute bottom-[15%] right-[15%] w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/50"></div>
                            {/* Bottom */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/50"></div>
                            {/* Bottom Left */}
                            <div className="absolute bottom-[15%] left-[15%] w-2.5 h-2.5 rounded-full bg-gradient-to-r from-rose-400 to-orange-500 shadow-lg shadow-rose-500/50"></div>
                            {/* Left */}
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 shadow-lg shadow-pink-500/50"></div>
                            {/* Top Left */}
                            <div className="absolute top-[15%] left-[15%] w-2.5 h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-lg shadow-cyan-500/50"></div>
                        </motion.div>
                        
                        {/* Additional orbiting ring with different speed */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-10 rounded-full z-0"
                        >
                            {/* Outer ring particles */}
                            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50"></div>
                            <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/50"></div>
                            <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/50"></div>
                            <div className="absolute top-1/2 left-[5%] -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 shadow-lg shadow-pink-500/50"></div>
                        </motion.div>
                        
                        {/* Image container with glassmorphism */}
                        <div className={`relative w-full h-full rounded-full overflow-hidden z-10 ${isDarkMode
                            ? 'ring-4 ring-white/10 shadow-2xl shadow-purple-500/20'
                            : 'ring-4 ring-white shadow-2xl shadow-purple-500/30'
                            }`}>
                            <img
                                src={
                                    // image_url = Supabase public URL returned by backend
                                    activeHero.image_url
                                    || activeHero.profile_image
                                    || 'https://placehold.co/400x400'
                                }
                                alt={activeHero.name}
                                onError={(e) => { e.target.src = 'https://placehold.co/400x400' }}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-in-out"
                            />
                        </div>

                        {/* Social links with glassmorphism */}
                        <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 backdrop-blur-xl border px-8 py-4 rounded-3xl flex gap-6 shadow-2xl z-20 transition-all duration-300 hover:scale-105 active:scale-105 ${isDarkMode
                            ? 'bg-neutral-900/70 border-white/10 shadow-rose-500/20'
                            : 'bg-white/80 border-white shadow-xl shadow-purple-500/10'
                            }`}>
                            {[
                                { name: 'Linkedin', url: 'https://www.linkedin.com/in/perumal-m-274413385/', gradient: 'from-blue-500 to-blue-600' },
                                { name: 'Github', url: 'https://github.com/Perumal2k6', gradient: 'from-gray-700 to-gray-900' },
                                { name: 'Twitter', url: 'https://x.com/Perumal_0303', gradient: 'from-cyan-400 to-blue-500' },
                                { name: 'Instagram', url: 'https://www.instagram.com/sasi__official__03?igsh=bGVpcHpoczN6Mnph', gradient: 'from-pink-500 via-purple-500 to-orange-500' }
                            ].map((Platform, i) => (
                                <motion.a 
                                    key={i} 
                                    href={Platform.url} 
                                    target={['Instagram', 'Github', 'Linkedin', 'Twitter'].includes(Platform.name) ? "_blank" : undefined} 
                                    rel={['Instagram', 'Github', 'Linkedin', 'Twitter'].includes(Platform.name) ? "noopener noreferrer" : undefined} 
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`group relative p-2 rounded-xl transition-all duration-300 ${
                                        isDarkMode ? 'text-neutral-400 hover:text-white active:text-white' : 'text-neutral-600 hover:text-neutral-900 active:text-neutral-900'
                                    }`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${Platform.gradient} rounded-xl opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 blur-sm`}></div>
                                    <div className="relative">
                                        {Platform.name === 'Linkedin' && <Linkedin size={22} />}
                                        {Platform.name === 'Github' && <Github size={22} />}
                                        {Platform.name === 'Twitter' && <Twitter size={22} />}
                                        {Platform.name === 'Instagram' && <Instagram size={22} />}
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="order-1 md:order-2 text-center md:text-left"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md text-xs font-bold tracking-widest uppercase mb-6 shadow-lg ${
                            isDarkMode 
                                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-emerald-500/20' 
                                : 'bg-emerald-50 border border-emerald-300 text-emerald-600 shadow-emerald-500/10'
                        }`}
                    >
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        Available for work
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6">
                        <span className={`text-transparent bg-clip-text animate-gradient ${
                            isDarkMode 
                                ? 'bg-gradient-to-r from-white via-rose-200 to-purple-300' 
                                : 'bg-gradient-to-r from-neutral-900 via-rose-600 to-purple-700'
                        }`}>
                            {activeHero.name}
                        </span>
                    </h1>

                    <h2 className={`text-2xl md:text-4xl font-light mb-4 flex flex-row flex-wrap items-center justify-center md:justify-start gap-x-2 ${isDarkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        <span>I am a</span>
                        <span className="font-bold flex items-center relative min-w-[200px]">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500 inline-block min-h-[1.2em] animate-gradient">
                                {displayText}
                            </span>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className="w-[3px] h-[1em] bg-gradient-to-b from-rose-500 to-purple-600 inline-block align-middle ml-0.5 rounded-full"
                            />
                        </span>
                    </h2>

                    <p className={`text-lg md:text-xl font-medium mb-10 max-w-2xl text-center md:text-left ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        Building scalable applications and turning complex problems into elegant, high-performance digital experiences.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 mt-10">
                        <motion.a
                            href="#contact"
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(244, 63, 94, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative px-8 py-4 font-bold rounded-2xl transition-all flex items-center gap-2 overflow-hidden group ${
                                isDarkMode 
                                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg shadow-rose-500/50 active:shadow-xl active:shadow-rose-500/60' 
                                    : 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg shadow-rose-500/30 active:shadow-xl active:shadow-rose-500/40'
                            }`}
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative z-10">Hire Me</span>
                        </motion.a>
                        <motion.button
                            onClick={handleResumeClick}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative px-8 py-4 font-bold rounded-2xl transition-all flex items-center gap-2 backdrop-blur-sm group ${
                                isDarkMode 
                                    ? 'border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 active:bg-white/10 active:border-white/40' 
                                    : 'border-2 border-neutral-300 text-neutral-900 hover:bg-neutral-900/5 hover:border-neutral-400 active:bg-neutral-900/5 active:border-neutral-400'
                            }`}
                        >
                            <Download size={18} className="group-hover:animate-bounce group-active:animate-bounce" /> 
                            <span>Resume</span>
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Hero
