import { motion } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import { useState, useEffect } from 'react'
import { projectsApi } from '../api/api'
import { toast } from 'sonner'

const Projects = ({ isDarkMode }) => {
    const [projects, setProjects] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await projectsApi.getAll()
                setProjects(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error('Failed to load projects:', error)
                toast.error('Could not connect to Projects API')
            } finally {
                setIsLoading(false)
            }
        }
        fetchProjects()
    }, [])

    if (isLoading) {
        return (
            <section id="projects" className="py-24 px-4 bg-transparent flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </section>
        )
    }

    return (
        <section id="projects" className="py-24 px-4 bg-transparent relative overflow-hidden">
            {/* Decorative gradient blobs */}
            <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] blur-[150px] rounded-full -z-10 ${isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-400/5'}`} />
            
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-between mb-16 gap-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-full"
                    >
                        <h2 className={`text-4xl md:text-6xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                            Featured{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500">
                                Work
                            </span>
                        </h2>
                        <p className={`max-w-2xl mx-auto text-lg ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            Exploring the intersection of design and technology through practical and innovative projects.
                        </p>
                    </motion.div>
                </div>

                {projects.length === 0 ? (
                    <p className={`text-center py-12 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        No projects showcased yet.
                    </p>
                ) : (
                    <div className={`grid gap-8 ${projects.length === 1 ? 'grid-cols-1 max-w-lg mx-auto' :
                        projects.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
                            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                        }`}>
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id || index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="relative group h-full flex flex-col"
                            >
                                <ProjectCard project={project} isDarkMode={isDarkMode} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default Projects
