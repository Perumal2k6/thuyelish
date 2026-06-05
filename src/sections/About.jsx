import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { aboutApi } from '../api/api'


const About = ({ data, isDarkMode }) => {
    const [aboutData, setAboutData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const response = await aboutApi.getAboutData()
                setAboutData(Array.isArray(response) ? response[0] : response)
            } catch (error) {
                if (error.message && (error.message.toLowerCase().includes('not found') || error.message.includes('404'))) {
                    setAboutData(null);
                } else {
                    console.error("Error fetching about data:", error)
                }
            } finally {
                setIsLoading(false)
            }
        }
        fetchAbout()
    }, [])

    const activeAbout = aboutData || {
        title: "Digital Architect",
        bio: "Login to the dashboard to setup your profile and save it to the database!",
        profile_image: "https://placehold.co/400x400",
    };

    return (
        <section id="about" className="py-24 px-4 bg-transparent overflow-hidden relative">
            {/* Decorative gradient blobs */}
            <div className={`absolute top-1/2 right-0 w-[500px] h-[500px] blur-[150px] rounded-full -z-10 ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-400/5'}`} />
            
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative group"
                    >
                        {/* Modern card with gradient border */}
                        <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden">
                            {/* Gradient border effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-purple-600 to-cyan-500 rounded-[40px] p-[3px]">
                                <div className={`w-full h-full rounded-[37px] overflow-hidden ${isDarkMode ? 'bg-neutral-950' : 'bg-gray-50'}`}>
                                    <img
                                        src={
                                            activeAbout.image_url
                                            || activeAbout.profile_image
                                            || 'https://placehold.co/400x400'
                                        }
                                        alt="About Me"
                                        onError={(e) => { e.target.src = 'https://placehold.co/400x400' }}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Modern Experience Badge with glassmorphism */}
                        <motion.div 
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95, rotate: -5 }}
                            className={`absolute -bottom-10 -right-10 backdrop-blur-xl p-10 rounded-[35px] shadow-2xl text-center border ${
                                isDarkMode 
                                    ? 'bg-gradient-to-br from-rose-500/90 to-purple-600/90 border-white/10 shadow-rose-500/50' 
                                    : 'bg-gradient-to-br from-rose-500 to-purple-600 border-white/20 shadow-rose-500/30'
                            }`}
                        >
                            <p className="text-5xl font-black text-white leading-none drop-shadow-lg">{activeAbout.experience_count || data.experienceCount}</p>
                            <p className="text-[10px] font-bold text-white/90 uppercase tracking-widest mt-2">Years Old</p>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-center md:text-left"
                    >
                        <h2 className={`text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase leading-none ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500">
                                {activeAbout.title || "Digital Architect"}
                            </span>
                            <br />
                            <span className={isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}>Since 2026</span>
                        </h2>
                        <div className="space-y-6">
                            {(activeAbout.bio || "").split('\n\n').map((para, i) => (
                                <p key={i} className={`text-lg leading-relaxed font-medium break-words ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                                    {para}
                                </p>
                            ))}
                        </div>

                        {/* Modern stats cards with glassmorphism */}
                        <div className="grid grid-cols-2 gap-6 mt-12">
                            <motion.div 
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.98, y: -3 }}
                                className={`p-6 rounded-3xl backdrop-blur-xl border transition-all duration-300 shadow-lg ${
                                    isDarkMode 
                                        ? 'bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 border-white/10 hover:border-rose-500/50 active:border-rose-500/50' 
                                        : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-neutral-200/50 hover:border-rose-500/50 active:border-rose-500/50 shadow-lg'
                                }`}
                            >
                                <p className={`text-4xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{activeAbout.projects_count || data.projectsCount}</p>
                                <p className="text-xs font-black uppercase tracking-widest bg-gradient-to-r from-rose-500 to-purple-600 text-transparent bg-clip-text">Projects Completed</p>
                            </motion.div>
                            <motion.div 
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.98, y: -3 }}
                                className={`p-6 rounded-3xl backdrop-blur-xl border transition-all duration-300 shadow-lg ${
                                    isDarkMode 
                                        ? 'bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 border-white/10 hover:border-purple-500/50 active:border-purple-500/50' 
                                        : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-neutral-200/50 hover:border-purple-500/50 active:border-purple-500/50 shadow-lg'
                                }`}
                            >
                                <p className={`text-4xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>100%</p>
                                <p className="text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-500 to-cyan-500 text-transparent bg-clip-text">Client Satisfaction</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default About
