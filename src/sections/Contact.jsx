import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { contactApi } from '../api/api'
import { toast } from 'sonner'

const Contact = ({ contactData, isDarkMode }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error('Please fill in all fields')
            return
        }

        setIsSubmitting(true)
        try {
            await contactApi.sendMessage(formData)
            toast.success('Message sent successfully!')
            setFormData({ name: '', email: '', subject: '', message: '' })
        } catch (error) {
            toast.error('Failed to send message')
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <section id="contact" className="py-24 px-4 bg-transparent relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center lg:text-left"
                    >
                        <h2 className={`text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                            Let's{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500">
                                Connect
                            </span>
                        </h2>
                        <p className={`text-xl mx-auto lg:mx-0 mb-16 leading-relaxed max-w-2xl ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            Have a project in mind? Let's discuss how we can bring your vision to life with modern technology and elite design.
                        </p>

                        <div className="space-y-10">
                            {[
                                { icon: Mail, label: "Email Me", value: contactData.email, href: `mailto:${contactData.email}` },
                                { icon: Phone, label: "Talk to Me", value: contactData.phone, href: `tel:${contactData.phone}` },
                                { icon: MapPin, label: "Location", value: contactData.location, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactData.location)}`, target: "_blank" }
                            ].map((item, idx) => {
                                const Wrapper = item.href ? 'a' : 'div'
                                return (
                                    <Wrapper key={idx} href={item.href} target={item.target} rel={item.target === "_blank" ? "noopener noreferrer" : undefined} className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-8 group cursor-pointer">
                                        <motion.div 
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            whileTap={{ scale: 0.95, rotate: -5 }}
                                            className={`w-16 h-16 shrink-0 backdrop-blur-xl border rounded-2xl flex items-center justify-center transition-all shadow-xl ${isDarkMode
                                            ? 'bg-gradient-to-br from-neutral-900/80 to-neutral-800/50 border-white/10 text-rose-400 group-hover:from-rose-500 group-hover:to-purple-600 group-hover:text-white group-hover:border-rose-500/50 group-hover:shadow-2xl group-hover:shadow-rose-500/50 group-active:from-rose-500 group-active:to-purple-600 group-active:text-white'
                                            : 'bg-gradient-to-br from-white/90 to-gray-50/70 border-neutral-200/50 text-rose-500 group-hover:from-rose-500 group-hover:to-purple-600 group-hover:text-white group-hover:border-rose-400/50 group-hover:shadow-2xl group-active:from-rose-500 group-active:to-purple-600 group-active:text-white'
                                            }`}>
                                            <item.icon size={24} />
                                        </motion.div>
                                        <div className="text-center lg:text-left">
                                            <p className="text-[10px] font-black uppercase tracking-widest mb-1 bg-gradient-to-r from-rose-500 to-purple-600 text-transparent bg-clip-text">{item.label}</p>
                                            <p className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{item.value}</p>
                                        </div>
                                    </Wrapper>
                                )
                            })}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={`backdrop-blur-xl border p-10 md:p-16 rounded-[50px] shadow-2xl transition-all duration-500 hover:-translate-y-2 active:-translate-y-1 ${isDarkMode
                            ? 'bg-gradient-to-br from-neutral-900/80 to-neutral-800/50 border-white/10 hover:border-rose-500/50 hover:shadow-rose-500/20 active:border-rose-500/50'
                            : 'bg-gradient-to-br from-white/90 to-gray-50/70 border-neutral-200/50 hover:border-rose-400/50 hover:shadow-2xl hover:shadow-rose-500/20 active:border-rose-400/50'
                            }`}
                    >
                        <form className="space-y-8" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-4">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                                        className={`w-full border rounded-2xl p-6 outline-none focus:border-rose-500 transition-all font-bold ${isDarkMode
                                            ? 'bg-neutral-900 border-neutral-800 text-white focus:bg-neutral-800'
                                            : 'bg-white border-neutral-200 text-neutral-900 focus:bg-neutral-50'
                                            }`}
                                        placeholder="Enter name"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-4">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                                        className={`w-full border rounded-2xl p-6 outline-none focus:border-rose-500 transition-all font-bold ${isDarkMode
                                            ? 'bg-neutral-900 border-neutral-800 text-white focus:bg-neutral-800'
                                            : 'bg-white border-neutral-200 text-neutral-900 focus:bg-neutral-50'
                                            }`}
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-4">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                                    className={`w-full border rounded-2xl p-6 outline-none focus:border-rose-500 transition-all font-bold ${isDarkMode
                                        ? 'bg-neutral-900 border-neutral-800 text-white focus:bg-neutral-800'
                                        : 'bg-white border-neutral-200 text-neutral-900 focus:bg-neutral-50'
                                        }`}
                                    placeholder="Inquiry about project"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-4">Message</label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                                    className={`w-full border rounded-2xl p-6 outline-none focus:border-rose-500 transition-all font-bold h-40 resize-none ${isDarkMode
                                        ? 'bg-neutral-900 border-neutral-800 text-white focus:bg-neutral-800'
                                        : 'bg-white border-neutral-200 text-neutral-900 focus:bg-neutral-50'
                                        }`}
                                    placeholder="Tell me about your vision..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-6 font-black rounded-3xl transition-all shadow-2xl uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isDarkMode
                                        ? 'bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white shadow-rose-500/50 hover:shadow-rose-500/70'
                                        : 'bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white shadow-rose-500/40 hover:shadow-rose-500/60'
                                }`}
                            >
                                {isSubmitting ? (
                                    <>Sending... <Loader2 size={20} className="animate-spin" /></>
                                ) : (
                                    <>Send Message <Send size={20} /></>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Contact
