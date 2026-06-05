import { motion } from 'framer-motion'
import { Monitor, Smartphone, Palette, Search, Zap, Code, Shield, Cpu } from 'lucide-react'

// Map to Lucide icons
const IconMap = {
    "Web Development": <Monitor size={32} />,
    "Mobile Solutions": <Smartphone size={32} />,
    "UI/UX Design": <Palette size={32} />,
    "SEO Optimization": <Search size={32} />,
    "Fast Performance": <Zap size={32} />,
    "Clean Code": <Code size={32} />,
    "Security First": <Shield size={32} />,
    "AI Integration": <Cpu size={32} />
}

const Services = ({ servicesData = [], isDarkMode }) => {
    return (
        <section id="services" className="py-24 px-4 bg-transparent relative overflow-hidden">
            {/* Decorative gradient blobs */}
            <div className={`absolute top-1/4 right-0 w-[500px] h-[500px] blur-[150px] rounded-full -z-10 ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-400/5'}`} />
            
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}
                    >
                        Elite{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500">
                            Solutions
                        </span>
                    </motion.h2>
                    <p className={`max-w-2xl mx-auto text-lg ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        Delivering high-performance digital products engineered for scalability and impact.
                    </p>
                </div>

                <div className={`grid gap-4 ${servicesData.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
                    servicesData.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
                        servicesData.length === 3 ? 'grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto' :
                            'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                    }`}>
                    {servicesData.map((service, idx) => (
                        <motion.div
                            key={service.id || `service-${idx}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            whileTap={{ y: -5, scale: 1.01 }}
                            className={`p-10 h-full rounded-[40px] backdrop-blur-xl transition-all duration-500 group flex flex-col items-center text-center shadow-xl ${isDarkMode
                                ? 'bg-gradient-to-br from-neutral-900/80 to-neutral-800/50 border border-white/10 hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/20 active:border-rose-500/50 active:shadow-2xl active:shadow-rose-500/20'
                                : 'bg-gradient-to-br from-white/90 to-gray-50/70 border border-neutral-200/50 hover:border-rose-400/50 hover:shadow-2xl hover:shadow-rose-500/20 active:border-rose-400/50 active:shadow-2xl active:shadow-rose-500/20'
                                }`}
                        >
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-rose-500/5 group-hover:via-purple-500/5 group-hover:to-cyan-500/5 group-active:from-rose-500/5 group-active:via-purple-500/5 group-active:to-cyan-500/5 transition-all duration-500 pointer-events-none rounded-[40px]"></div>
                            
                            <motion.div 
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 1.05, rotate: 0 }}
                                className={`mb-8 p-5 rounded-3xl w-fit transition-all duration-300 relative z-10 shadow-lg ${
                                    isDarkMode 
                                        ? 'bg-gradient-to-br from-neutral-800 to-neutral-900 text-rose-400 group-hover:from-rose-500 group-hover:to-purple-600 group-hover:text-white group-hover:shadow-rose-500/50 group-active:from-rose-500 group-active:to-purple-600 group-active:text-white' 
                                        : 'bg-gradient-to-br from-rose-50 to-purple-50 text-rose-500 group-hover:from-rose-500 group-hover:to-purple-600 group-hover:text-white group-hover:shadow-lg group-active:from-rose-500 group-active:to-purple-600 group-active:text-white'
                                }`}
                            >
                                {IconMap[service.title] || <Code size={32} />}
                            </motion.div>
                            <h3 className={`text-2xl font-black mb-4 uppercase tracking-tight leading-tight relative z-10 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                {service.title || 'Untitled Service'}
                            </h3>
                            <p className={`leading-relaxed font-medium break-words relative z-10 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                                {service.description || ''}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Services
