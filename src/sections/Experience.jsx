import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { experienceApi } from '../api/api'
import { Briefcase, Calendar, Building2, ChevronDown, ChevronUp } from 'lucide-react'

const Experience = ({ isDarkMode }) => {
    const [experiences, setExperiences] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [expandedId, setExpandedId] = useState(null)

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const data = await experienceApi.getAll()
                setExperiences(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error('Failed to load experiences:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchExpenses()
    }, [])

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id)
    }

    if (isLoading) {
        return (
            <section id="experience" className="py-24 px-4 bg-transparent flex justify-center items-center">
                <div className="w-16 h-16 relative">
                    <div className="w-16 h-16 border-4 border-transparent border-t-rose-500 border-r-purple-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-cyan-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
                </div>
            </section>
        )
    }

    return (
        <section id="experience" className="py-24 px-4 bg-transparent relative overflow-hidden">
            {/* Decorative gradient blobs */}
            <div className={`absolute top-1/3 left-0 w-[500px] h-[500px] blur-[150px] rounded-full -z-10 ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-400/5'}`} />
            <div className={`absolute bottom-1/4 right-0 w-[400px] h-[400px] blur-[150px] rounded-full -z-10 ${isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-400/5'}`} />
            
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`text-4xl md:text-6xl font-black mb-6 tracking-tight ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}
                    >
                        Work{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500">
                            Experience
                        </span>
                    </motion.h2>
                    <p className={`max-w-2xl mx-auto text-lg ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        My professional journey and the amazing companies I've worked with
                    </p>
                </div>

                {experiences.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`text-center py-20 px-8 rounded-3xl backdrop-blur-xl border ${
                            isDarkMode 
                                ? 'bg-neutral-900/50 border-white/10' 
                                : 'bg-white/70 border-neutral-200/50'
                        }`}
                    >
                        <Briefcase size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`} />
                        <p className={`text-lg font-medium ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                            No work experience listed yet.
                        </p>
                    </motion.div>
                ) : (
                    <div className="relative">
                        {/* Modern Timeline Line */}
                        <div className={`hidden md:block absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 ${
                            isDarkMode ? 'bg-gradient-to-b from-rose-500/20 via-purple-500/20 to-cyan-500/20' : 'bg-gradient-to-b from-rose-400/30 via-purple-400/30 to-cyan-400/30'
                        }`} />

                        <div className="space-y-12">
                            {experiences.map((exp, idx) => {
                                const isExpanded = expandedId === exp.id
                                const isEven = idx % 2 === 0

                                return (
                                    <motion.div
                                        key={exp.id || idx}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.2, duration: 0.5 }}
                                        viewport={{ once: true }}
                                        className={`relative ${isEven ? 'md:pr-1/2' : 'md:pl-1/2 md:ml-auto'} md:w-[calc(50%+2rem)]`}
                                    >
                                        {/* Timeline Node */}
                                        <motion.div 
                                            whileHover={{ scale: 1.2, rotate: 180 }}
                                            whileTap={{ scale: 1.1, rotate: 90 }}
                                            className={`hidden md:block absolute top-8 ${isEven ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'} w-6 h-6 rounded-full z-10 ${
                                                isDarkMode 
                                                    ? 'bg-gradient-to-br from-rose-500 via-purple-500 to-cyan-500 shadow-lg shadow-rose-500/50' 
                                                    : 'bg-gradient-to-br from-rose-500 via-purple-500 to-cyan-500 shadow-xl shadow-rose-500/40'
                                            }`}
                                        >
                                            <div className={`absolute inset-1 rounded-full ${isDarkMode ? 'bg-neutral-950' : 'bg-white'}`} />
                                        </motion.div>

                                        {/* Experience Card */}
                                        <motion.div
                                            whileHover={{ scale: 1.02, y: -5 }}
                                            whileTap={{ scale: 1.01, y: -3 }}
                                            className={`relative backdrop-blur-xl rounded-3xl overflow-hidden border shadow-2xl transition-all duration-500 cursor-pointer ${
                                                isDarkMode 
                                                    ? 'bg-gradient-to-br from-neutral-900/90 to-neutral-800/70 border-white/10 hover:border-rose-500/50 hover:shadow-rose-500/20 active:border-rose-500/50 active:shadow-rose-500/20' 
                                                    : 'bg-gradient-to-br from-white/95 to-gray-50/80 border-neutral-200/50 hover:border-rose-400/50 hover:shadow-2xl hover:shadow-rose-500/20 active:border-rose-400/50 active:shadow-2xl active:shadow-rose-500/20'
                                            }`}
                                            onClick={() => toggleExpand(exp.id)}
                                        >
                                            {/* Gradient overlay on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 via-purple-500/0 to-cyan-500/0 hover:from-rose-500/5 hover:via-purple-500/5 hover:to-cyan-500/5 active:from-rose-500/5 active:via-purple-500/5 active:to-cyan-500/5 transition-all duration-500 pointer-events-none" />

                                            <div className="relative z-10 p-8">
                                                {/* Header */}
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="flex-1">
                                                        {/* Period Badge */}
                                                        <motion.div 
                                                            initial={{ opacity: 0, x: -20 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.3 }}
                                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md text-xs font-bold uppercase tracking-widest mb-4 ${
                                                                isDarkMode 
                                                                    ? 'bg-gradient-to-r from-rose-500/10 to-purple-500/10 border border-rose-500/30 text-rose-400' 
                                                                    : 'bg-gradient-to-r from-rose-50 to-purple-50 border border-rose-300 text-rose-600'
                                                            }`}
                                                        >
                                                            <Calendar size={14} />
                                                            {exp.period || 'Present'}
                                                        </motion.div>

                                                        {/* Company & Role */}
                                                        <h3 className={`text-3xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                                            <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:via-purple-500 group-hover:to-cyan-500">
                                                                {exp.company || 'Company Name'}
                                                            </span>
                                                        </h3>
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <Briefcase size={18} className="text-purple-500" />
                                                            <p className={`text-lg font-bold ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                                                                {exp.role || 'Job Title'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Company Icon */}
                                                    <motion.div 
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                        whileTap={{ scale: 1.05, rotate: 0 }}
                                                        className={`p-4 rounded-2xl backdrop-blur-sm ${
                                                            isDarkMode 
                                                                ? 'bg-gradient-to-br from-neutral-800 to-neutral-900 text-cyan-400' 
                                                                : 'bg-gradient-to-br from-cyan-50 to-purple-50 text-cyan-600'
                                                        }`}
                                                    >
                                                        <Building2 size={32} />
                                                    </motion.div>
                                                </div>

                                                {/* Description */}
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: isExpanded ? 'auto' : '0' }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className={`pt-4 border-t ${isDarkMode ? 'border-white/10' : 'border-neutral-200/50'}`}>
                                                        <p className={`leading-relaxed text-base ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                                                            {exp.description || 'No description provided'}
                                                        </p>
                                                    </div>
                                                </motion.div>

                                                {/* Expand Button */}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className={`mt-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                                                        isDarkMode 
                                                            ? 'text-rose-400 hover:text-rose-300' 
                                                            : 'text-rose-600 hover:text-rose-500'
                                                    }`}
                                                >
                                                    {isExpanded ? (
                                                        <>
                                                            Show Less <ChevronUp size={16} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            Read More <ChevronDown size={16} />
                                                        </>
                                                    )}
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default Experience
