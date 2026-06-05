import { motion } from 'framer-motion'
import { ExternalLink, Github, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const ProjectCard = ({ project, isDarkMode }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const tags = Array.isArray(project.tags)
        ? project.tags
        : (typeof project.tags === 'string' && project.tags.trim() !== ''
            ? project.tags.split(',').map(t => t.trim())
            : []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ y: -5, scale: 1.01 }}
            className={`group relative rounded-3xl overflow-hidden transition-all duration-500 h-full flex flex-col backdrop-blur-xl shadow-xl ${isDarkMode
                ? 'bg-gradient-to-br from-neutral-900/80 to-neutral-800/50 border border-white/10 hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/20 active:border-rose-500/50 active:shadow-2xl active:shadow-rose-500/20'
                : 'bg-gradient-to-br from-white/90 to-gray-50/70 border border-neutral-200/50 hover:border-rose-400/50 hover:shadow-2xl hover:shadow-rose-500/20 active:border-rose-400/50 active:shadow-2xl active:shadow-rose-500/20'
                }`}
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-rose-500/5 group-hover:via-purple-500/5 group-hover:to-cyan-500/5 group-active:from-rose-500/5 group-active:via-purple-500/5 group-active:to-cyan-500/5 transition-all duration-500 pointer-events-none z-10"></div>
            
            <div className="shrink-0 aspect-video overflow-hidden relative">
                {/* Gradient border on image */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 z-10"></div>
                <img
                    src={project.image_url || project.image || 'https://placehold.co/800x450'}
                    alt={project.title}
                    onError={(e) => { e.target.src = 'https://placehold.co/800x450' }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
            </div>

            <div className="p-6 md:p-8 flex flex-col flex-grow relative z-20">
                <div className="flex flex-wrap gap-2 mb-4 shrink-0">
                    {tags.map((tag, index) => (
                        <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-sm border whitespace-nowrap transition-all duration-300 ${isDarkMode
                                ? 'bg-gradient-to-r from-rose-500/10 to-purple-500/10 text-rose-400 border-rose-500/30 hover:border-rose-500/60 hover:shadow-lg hover:shadow-rose-500/20 active:border-rose-500/60 active:shadow-lg active:shadow-rose-500/20'
                                : 'bg-gradient-to-r from-rose-50 to-purple-50 text-rose-600 border-rose-200 hover:border-rose-400 hover:shadow-md active:border-rose-400 active:shadow-md'
                                }`}
                        >
                            {tag}
                        </motion.span>
                    ))}
                </div>

                <h3 className={`text-2xl font-black mb-3 shrink-0 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:via-purple-500 group-hover:to-cyan-500 group-active:text-transparent group-active:bg-clip-text group-active:bg-gradient-to-r group-active:from-rose-500 group-active:via-purple-500 group-active:to-cyan-500 transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                    {project.title}
                </h3>

                <div className="mb-8 flex-grow">
                    <p className={`leading-relaxed text-sm ${!isExpanded ? 'line-clamp-2' : ''} ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {project.description}
                    </p>
                    {project.description && project.description.length > 90 && (
                        <button
                            onClick={(e) => { e.preventDefault(); setIsExpanded(!isExpanded); }}
                            className={`mt-3 flex items-center gap-1 text-[10px] uppercase font-black tracking-widest transition-all duration-300 hover:gap-2 active:gap-2 ${isDarkMode ? 'text-rose-400 hover:text-rose-300 active:text-rose-300' : 'text-rose-600 hover:text-rose-500 active:text-rose-500'
                                }`}
                        >
                            {isExpanded ? (
                                <>Read Less <ChevronUp size={14} /></>
                            ) : (
                                <>Read More <ChevronDown size={14} /></>
                            )}
                        </button>
                    )}
                </div>

                <div className={`flex items-center gap-4 shrink-0 mt-auto pt-6`}>
                    <motion.a
                        href={project.github_url || 'https://github.com/Perumal2k6'}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-3 rounded-2xl transition-all duration-300 shadow-lg ${isDarkMode
                            ? 'bg-gradient-to-br from-neutral-800 to-neutral-900 text-white hover:from-rose-500 hover:to-purple-600 hover:shadow-rose-500/50 active:from-rose-500 active:to-purple-600 active:shadow-rose-500/50'
                            : 'bg-gradient-to-br from-gray-100 to-gray-200 text-neutral-900 hover:from-rose-500 hover:to-purple-600 hover:text-white hover:shadow-lg active:from-rose-500 active:to-purple-600 active:text-white'
                            }`}>
                        <Github size={20} />
                    </motion.a>
                    <motion.a
                        href={project.live_url || project.link || '#'}
                        target={(project.live_url || project.link) ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            if (!project.live_url && !project.link) {
                                e.preventDefault();
                                toast.success('Live preview not available for this project');
                            }
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg ${isDarkMode
                            ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:from-rose-600 hover:to-purple-700 hover:shadow-rose-500/50 active:shadow-rose-500/60'
                            : 'bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:from-rose-600 hover:to-purple-700 hover:shadow-xl active:shadow-2xl'
                            }`}>
                        <span>Live Preview</span> <ExternalLink size={16} />
                    </motion.a>
                </div>
            </div>
        </motion.div>
    )
}

export default ProjectCard
