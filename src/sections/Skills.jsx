import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { skillsApi } from '../api/api'

const Skills = ({ isDarkMode }) => {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const data = await skillsApi.getAll()
                setCategories(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error('Failed to load skills:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchSkills()
    }, [])

    if (isLoading) {
        return (
            <section id="skills" className="py-24 px-4 bg-transparent flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </section>
        )
    }

    return (
        <section id="skills" className="py-24 px-4 bg-transparent relative overflow-hidden">
            {/* Decorative gradient blob */}
            <div className={`absolute bottom-0 right-1/4 w-[400px] h-[400px] blur-[150px] rounded-full -z-10 ${isDarkMode ? 'bg-rose-500/10' : 'bg-rose-400/5'}`} />
            
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`text-4xl md:text-6xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}
                    >
                        My{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500">
                            Expertise
                        </span>
                    </motion.h2>
                    <p className={`max-w-2xl mx-auto text-lg ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        I've spent years honing my skills across the entire stack to provide comprehensive digital solutions.
                    </p>
                </div>

                {categories.length === 0 ? (
                    <p className="text-center text-neutral-500">No skills added yet. Add them via the Dashboard.</p>
                ) : (
                    <div className={`grid gap-8 justify-center ${categories.length === 1
                        ? 'grid-cols-1 max-w-sm mx-auto'
                        : categories.length === 2
                            ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto'
                            : categories.length === 3
                                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto'
                                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-auto'
                        }`}>
                        {categories.map((cat, idx) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                whileTap={{ y: -5, scale: 1.01 }}
                                className={`p-8 rounded-3xl backdrop-blur-xl border transition-all duration-500 group h-full flex flex-col items-center text-center shadow-xl ${isDarkMode
                                    ? 'bg-gradient-to-br from-neutral-900/80 to-neutral-800/50 border-white/10 hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/20 active:border-rose-500/50 active:shadow-2xl active:shadow-rose-500/20'
                                    : 'bg-gradient-to-br from-white/90 to-gray-50/70 border-neutral-200/50 hover:border-rose-400/50 hover:shadow-2xl hover:shadow-rose-500/20 active:border-rose-400/50 active:shadow-2xl active:shadow-rose-500/20'
                                    }`}
                            >
                                {/* Gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-rose-500/5 group-hover:via-purple-500/5 group-hover:to-cyan-500/5 group-active:from-rose-500/5 group-active:via-purple-500/5 group-active:to-cyan-500/5 transition-all duration-500 pointer-events-none rounded-3xl"></div>
                                
                                <h3 className={`text-xl font-black mb-6 uppercase tracking-wider relative z-10 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                    <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:via-purple-500 group-hover:to-cyan-500 group-active:text-transparent group-active:bg-clip-text group-active:bg-gradient-to-r group-active:from-rose-500 group-active:via-purple-500 group-active:to-cyan-500 transition-all duration-300">
                                        {cat.category}
                                    </span>
                                </h3>
                                <div className="flex justify-center w-full relative z-10">
                                    <ul className="space-y-3 flex flex-col items-start">
                                        {(cat.items || []).map(skill => (
                                            <li key={skill.id} className={`flex items-center gap-3 transition-all duration-300 group-hover:translate-x-1 group-active:translate-x-1 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 flex-shrink-0 group-hover:shadow-lg group-hover:shadow-rose-500/50 group-active:shadow-lg group-active:shadow-rose-500/50" />
                                                <span className="font-medium">{skill.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default Skills
