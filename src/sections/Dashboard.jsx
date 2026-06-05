import { motion } from 'framer-motion'
import { Plus, X, Save, ArrowLeft, Trash2, Camera, Upload, Trash, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import {
    heroApi, getImageUrl,
    aboutApi, getAboutImageUrl,
    skillsApi,
    experienceApi,
    projectsApi,
    serviceApi,
    contactApi,
    contactInfoApi,
} from '../api/api'
import { toast } from 'sonner'
import ImageCropper from '../components/ImageCropper'


const Dashboard = ({ data, updateData, onBack, isDarkMode }) => {
    const [activeTab, setActiveTab] = useState('profile')
    const [formData, setFormData] = useState(data)
    const [heroId, setHeroId] = useState(null)
    const [isSavingHero, setIsSavingHero] = useState(false)
    const [aboutId, setAboutId] = useState(null)
    const [isSavingAbout, setIsSavingAbout] = useState(false)
    // Store actual File objects for upload (separate from preview URLs)
    const [heroImageFile, setHeroImageFile] = useState(null)
    const [aboutImageFile, setAboutImageFile] = useState(null)

    // Skills — live from API
    const [skills, setSkills] = useState([])         // [{ id, category, items: [{id, name}] }]
    const [skillsLoading, setSkillsLoading] = useState(false)
    const [skillsWorking, setSkillsWorking] = useState(false) // true during any write operation

    // Experience — live from API
    const [experiences, setExperiences] = useState([])
    const [expLoading, setExpLoading] = useState(false)
    const [expWorking, setExpWorking] = useState(false)

    // Projects — live from API
    const [projects, setProjects] = useState([])
    const [projectsLoading, setProjectsLoading] = useState(false)
    const [projectsWorking, setProjectsWorking] = useState(false)

    // Services — live from API
    const [services, setServices] = useState([])
    const [servicesLoading, setServicesLoading] = useState(false)
    const [servicesWorking, setServicesWorking] = useState(false)

    // Messages — live from API
    const [messages, setMessages] = useState([])
    const [messagesLoading, setMessagesLoading] = useState(false)
    const [messagesWorking, setMessagesWorking] = useState(false)

    // Contact Info — live from API
    const [contactInfo, setContactInfo] = useState({ id: null, email: '', phone: '', location: '' })
    const [contactInfoLoading, setContactInfoLoading] = useState(false)
    const [contactInfoWorking, setContactInfoWorking] = useState(false)

    // Crop modal state
    const [cropModal, setCropModal] = useState({ isOpen: false, src: null, target: null, aspect: 1 })

    // Fetch existing hero and about on mount to pre-fill form & grab IDs for updates
    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const resHero = await heroApi.getHeroData()
                const hero = Array.isArray(resHero) ? resHero[0] : resHero
                if (hero && hero.id) {
                    setHeroId(hero.id)
                    setFormData(prev => ({
                        ...prev,
                        name: hero.name || '',
                        heroTitle: hero.title || prev.heroTitle || '',
                        resumeLink: hero.resume_url || '',
                        // image_url is the Supabase public URL returned by the backend
                        profileImageDb: hero.image_url || hero.profile_image || null,
                    }))
                }
            } catch (error) {
                console.log("No hero in database, next save will create one.");
            }

            try {
                const resAbout = await aboutApi.getAboutData()
                const about = Array.isArray(resAbout) ? resAbout[0] : resAbout
                if (about && about.id) {
                    setAboutId(about.id)
                    setFormData(prev => ({
                        ...prev,
                        aboutTitle: about.title || prev.aboutTitle || '',
                        aboutText: about.bio || prev.aboutText || '',
                        // image_url is the Supabase public URL returned by the backend
                        aboutImageDb: about.image_url || about.profile_image || null,
                        experienceCount: about.experience_count || prev.experienceCount || '',
                        projectsCount: about.projects_count || prev.projectsCount || '',
                    }))
                }
            } catch (error) {
                console.log("No about in database, next save will create one.");
            }
        }
        fetchMeta()
    }, [])

    // Load skills from API when the skills tab is opened
    useEffect(() => {
        if (activeTab !== 'skills') return
        const loadSkills = async () => {
            setSkillsLoading(true)
            try {
                const data = await skillsApi.getAll()
                setSkills(Array.isArray(data) ? data : [])
            } catch (err) {
                toast.error('Failed to load skills')
            } finally {
                setSkillsLoading(false)
            }
        }
        loadSkills()
    }, [activeTab])

    // Load experiences from API when the experience tab is opened
    useEffect(() => {
        if (activeTab !== 'experience') return
        const loadExp = async () => {
            setExpLoading(true)
            try {
                const data = await experienceApi.getAll()
                setExperiences(Array.isArray(data) ? data : [])
            } catch (err) {
                toast.error('Failed to load experiences')
            } finally {
                setExpLoading(false)
            }
        }
        loadExp()
    }, [activeTab])

    // Load projects from API when the projects tab is opened
    useEffect(() => {
        if (activeTab !== 'projects') return
        const loadProj = async () => {
            setProjectsLoading(true)
            try {
                const data = await projectsApi.getAll()
                setProjects(Array.isArray(data) ? data : [])
            } catch (err) {
                toast.error('Failed to load projects')
            } finally {
                setProjectsLoading(false)
            }
        }
        loadProj()
    }, [activeTab])

    // Load services from API when the services tab is opened
    useEffect(() => {
        if (activeTab !== 'services') return
        const loadServices = async () => {
            setServicesLoading(true)
            try {
                const data = await serviceApi.getAll()
                setServices(Array.isArray(data) ? data : [])
            } catch (err) {
                toast.error('Failed to load services')
            } finally {
                setServicesLoading(false)
            }
        }
        loadServices()
    }, [activeTab])

    // Load messages from API when the messages tab is opened
    useEffect(() => {
        if (activeTab !== 'messages') return
        const loadMessages = async () => {
            setMessagesLoading(true)
            try {
                const data = await contactApi.getMessages()
                setMessages(Array.isArray(data) ? data : [])
            } catch (err) {
                toast.error('Failed to load messages')
            } finally {
                setMessagesLoading(false)
            }
        }
        loadMessages()
    }, [activeTab])

    // Load contact info from API when the contact tab is opened
    useEffect(() => {
        if (activeTab !== 'contact') return
        const loadContactInfo = async () => {
            setContactInfoLoading(true)
            try {
                const info = await contactInfoApi.getContact()
                if (info) {
                    setContactInfo({
                        id: info.id || null,
                        email: info.email || '',
                        phone: info.phone || '',
                        location: info.location || ''
                    })
                }
            } catch (err) {
                // If 404, it just means no config exists yet, which is fine
                if (err?.message !== "Contact not found") {
                    console.error("Failed to load contact info:", err)
                }
            } finally {
                setContactInfoLoading(false)
            }
        }
        loadContactInfo()
    }, [activeTab])

    const handleSaveGeneral = () => {
        updateData(formData)
        toast.success('Live preview updated successfully!')
    }

    const handleSaveHero = async () => {
        setIsSavingHero(true)
        try {
            const payload = {
                name: formData.name,
                title: formData.heroTitle || formData.aboutTitle || 'Full Stack Developer',
                bio: formData.aboutText || 'Crafting digital experiences.',
                resume_url: formData.resumeLink || '',
                imageFile: heroImageFile || undefined, // actual File object or undefined
            }

            if (heroId) {
                const res = await heroApi.updateHero(heroId, payload)
                // Backend returns image_url (Supabase public URL) after upload
                if (res?.image_url) {
                    setFormData(prev => ({ ...prev, profileImageDb: res.image_url, profileImage: null }))
                }
                toast.success('Hero Profile Updated in Database!', { id: 'hero-op' })
            } else {
                const res = await heroApi.createHero(payload)
                if (res?.id) setHeroId(res.id)
                // Backend returns image_url (Supabase public URL) after upload
                if (res?.image_url) {
                    setFormData(prev => ({ ...prev, profileImageDb: res.image_url, profileImage: null }))
                }
                toast.success('Hero Profile Created in Database!', { id: 'hero-op' })
            }
            setHeroImageFile(null) // clear after successful upload
        } catch (error) {
            console.error('Error saving hero:', error)
            toast.error(`Failed to save hero: ${error.message}`, { id: 'hero-op' })
        } finally {
            setIsSavingHero(false)
        }
    }

    const handleSaveAbout = async () => {
        setIsSavingAbout(true)
        try {
            const payload = {
                title: formData.aboutTitle || 'Digital Architect',
                bio: formData.aboutText || 'Setup your profile in the dashboard.',
                experience_count: formData.experienceCount || '0+',
                projects_count: formData.projectsCount || '0+',
                imageFile: aboutImageFile || undefined, // actual File object or undefined
            }

            if (aboutId) {
                const res = await aboutApi.updateAbout(aboutId, payload)
                // Backend returns image_url (Supabase public URL) after upload
                if (res?.image_url) {
                    setFormData(prev => ({ ...prev, aboutImageDb: res.image_url, aboutImage: null }))
                }
                toast.success('About Section Updated in Database!', { id: 'about-op' })
            } else {
                const res = await aboutApi.createAbout(payload)
                if (res?.id) setAboutId(res.id)
                // Backend returns image_url (Supabase public URL) after upload
                if (res?.image_url) {
                    setFormData(prev => ({ ...prev, aboutImageDb: res.image_url, aboutImage: null }))
                }
                toast.success('About Section Created in Database!', { id: 'about-op' })
            }
            setAboutImageFile(null) // clear after successful upload
        } catch (error) {
            console.error('Error saving about:', error)
            toast.error(`Failed to save about: ${error.message}`, { id: 'about-op' })
        } finally {
            setIsSavingAbout(false)
        }
    }

    const handleSaveContactInfo = async () => {
        setContactInfoWorking(true)
        try {
            const payload = {
                email: contactInfo.email,
                phone: contactInfo.phone,
                location: contactInfo.location
            }
            if (contactInfo.id) {
                await contactInfoApi.updateContact(contactInfo.id, payload)
                toast.success('Contact info updated in database!', { id: 'contact-op' })
            } else {
                const res = await contactInfoApi.createContact(payload)
                if (res?.id) {
                    setContactInfo(prev => ({ ...prev, id: res.id }))
                }
                toast.success('Contact info created in database!', { id: 'contact-op' })
            }
        } catch (error) {
            console.error('Error saving contact info:', error)
            toast.error(`Failed to save contact info: ${error.message}`, { id: 'contact-op' })
        } finally {
            setContactInfoWorking(false)
        }
    }

    /**
     * Image upload handler.
     * Opens the crop modal instead of immediately saving the file.
     */
    const handleImageUpload = (e, target) => {
        const file = e.target.files[0]
        if (!file) return

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            toast.error('Only JPG, PNG, and WEBP images are allowed.')
            e.target.value = null
            return
        }

        // Generate a temporary local blob URL for cropping
        const previewUrl = URL.createObjectURL(file)
        const aspect = target === 'profileImage' ? 1 : 4 / 5
        setCropModal({ isOpen: true, src: previewUrl, target, aspect })

        // Clear value so the same file triggers onChange again
        e.target.value = null
    }

    const handleCropComplete = (croppedFile) => {
        const { target } = cropModal

        // Generate a new URL for the cropped file
        const croppedUrl = URL.createObjectURL(croppedFile)

        if (target === 'profileImage') setHeroImageFile(croppedFile)
        if (target === 'aboutImage') setAboutImageFile(croppedFile)

        setFormData(prev => ({ ...prev, [target]: croppedUrl }))
        setCropModal({ isOpen: false, src: null, target: null, aspect: 1 })
    }

    const handleCropCancel = () => {
        setCropModal({ isOpen: false, src: null, target: null, aspect: 1 })
    }

    // File Helper: Store PDF as local object URL for display/download
    const handleFileUpload = (e, target) => {
        const file = e.target.files[0]
        if (!file) return

        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed.')
            e.target.value = null
            return
        }

        const previewUrl = URL.createObjectURL(file)
        setFormData(prev => ({ ...prev, [target]: previewUrl }))
        toast.success('Resume selected! Save to Database to upload.')
    }

    const addSkill = () => {
        const skill = prompt('Enter new skill:')
        if (skill) setFormData({ ...formData, skills: [...formData.skills, skill] })
    }

    const inputClasses = `w-full rounded-2xl p-6 outline-none focus:border-rose-500 transition-all font-bold ${isDarkMode
        ? 'bg-neutral-950 border border-neutral-800 text-white'
        : 'bg-white border border-neutral-200 text-neutral-900 shadow-sm'
        }`

    const cardClasses = `rounded-[50px] p-8 md:p-14 border ${isDarkMode
        ? 'bg-neutral-900 border-neutral-800'
        : 'bg-white border-neutral-200 shadow-xl'
        }`

    const labelClasses = "block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-4"

    return (
        <div className={`min-h-screen pt-32 pb-20 px-4 ${isDarkMode ? 'bg-neutral-950' : 'bg-neutral-50'}`}>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div>
                        <button
                            onClick={onBack}
                            className={`flex items-center gap-2 mb-4 transition-colors font-black uppercase tracking-widest text-[10px] ${isDarkMode ? 'text-neutral-500 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
                                }`}
                        >
                            <ArrowLeft size={16} /> Back to Preview
                        </button>
                        <h1 className={`text-4xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                            Portfolio <span className="text-rose-500">System</span>
                        </h1>
                    </div>
                    {/* Only show general save block if not on profile/about/contact settings (which have dedicated save now) */}
                    {activeTab !== 'profile' && activeTab !== 'about' && activeTab !== 'contact' && (
                        <button
                            onClick={handleSaveGeneral}
                            className="w-full md:w-auto px-10 py-5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-3xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-rose-600/30 uppercase tracking-widest text-xs"
                        >
                            <Save size={18} /> Update Live Site
                        </button>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Tabs */}
                    <div className="lg:w-1/4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2 h-fit">
                        {['profile', 'about', 'experience', 'skills', 'services', 'projects', 'messages', 'contact'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`w-full text-left px-8 py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] transition-all border ${activeTab === tab
                                    ? 'bg-rose-600 text-white border-rose-500 shadow-xl shadow-rose-600/20'
                                    : isDarkMode
                                        ? 'text-neutral-500 hover:bg-neutral-900 border-neutral-800'
                                        : 'text-neutral-500 hover:bg-white border-transparent hover:shadow-lg'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className={`lg:w-3/4 ${cardClasses}`}>

                        {/* PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <div className="space-y-10">
                                <div className={`flex flex-col md:flex-row items-center gap-10 border-b pb-10 ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
                                    <div className="relative group">
                                        <img
                                            src={
                                                // blob preview while upload pending, then Supabase URL
                                                formData.profileImage
                                                || formData.profileImageDb
                                                || 'https://placehold.co/160x160'
                                            }
                                            onError={(e) => { e.target.src = 'https://placehold.co/160x160' }}
                                            className="w-40 h-40 rounded-full object-cover border-4 border-neutral-800 shadow-2xl"
                                            alt="Profile"
                                        />
                                        <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <Camera className="text-white" size={24} />
                                            <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={(e) => handleImageUpload(e, 'profileImage')} />
                                        </label>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <h3 className={`text-xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Primary Identity</h3>
                                        <p className="text-neutral-500 text-sm">Upload your professional portrait photo here.</p>
                                        <div className="pt-4 flex gap-4">
                                            <label className={`px-6 py-3 border rounded-xl text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all cursor-pointer inline-flex items-center gap-2 ${isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
                                                }`}>
                                                <Upload size={14} /> {heroImageFile ? `✓ ${heroImageFile.name}` : 'Upload New Photo'}
                                                <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={(e) => handleImageUpload(e, 'profileImage')} />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className={labelClasses}>Display Name</label>
                                        <input
                                            className={inputClasses}
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Resume Upload (PDF)</label>
                                        <div className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all min-h-[74px] ${isDarkMode ? 'border-neutral-800 hover:border-rose-500 bg-neutral-950' : 'border-neutral-200 hover:border-rose-500 bg-neutral-50'}`}>
                                            <input
                                                type="file"
                                                id="resume-upload"
                                                className="hidden"
                                                accept="application/pdf"
                                                onChange={(e) => handleFileUpload(e, 'resumeLink')}
                                            />
                                            <label htmlFor="resume-upload" className={`cursor-pointer font-bold text-sm flex items-center gap-2 ${isDarkMode ? 'text-neutral-400 hover:text-rose-500' : 'text-neutral-500 hover:text-rose-600'}`}>
                                                <Upload size={18} />
                                                {formData.resumeLink ? 'Resume Selected (Click to Replace)' : 'Select PDF File'}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-neutral-800 flex justify-end">
                                    <button
                                        onClick={handleSaveHero}
                                        disabled={isSavingHero}
                                        className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black rounded-3xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-emerald-600/30 uppercase tracking-widest text-xs"
                                    >
                                        <Save size={18} /> {isSavingHero ? 'Saving to Database...' : 'Save Profile DB'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ABOUT TAB */}
                        {activeTab === 'about' && (
                            <div className="space-y-8">
                                <div className={`flex flex-col md:flex-row items-center gap-10 border-b pb-10 ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
                                    <div className="relative group">
                                        <img
                                            src={
                                                // blob preview while upload pending, then Supabase URL
                                                formData.aboutImage
                                                || formData.aboutImageDb
                                                || 'https://placehold.co/400x400'
                                            }
                                            onError={(e) => { e.target.src = 'https://placehold.co/400x400' }}
                                            className="w-40 h-40 rounded-[20px] object-cover border-4 border-neutral-800 shadow-2xl"
                                            alt="About"
                                        />
                                        <label className="absolute inset-0 bg-black/60 rounded-[20px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <Camera className="text-white" size={24} />
                                            <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={(e) => handleImageUpload(e, 'aboutImage')} />
                                        </label>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <h3 className={`text-xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>About Visual</h3>
                                        <p className="text-xs font-bold text-neutral-500 max-w-sm">
                                            Upload an alternate aesthetic image for your About section (recommended size 400x500).
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>About Title</label>
                                    <input
                                        className={inputClasses}
                                        value={formData.aboutTitle}
                                        onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className={labelClasses}>About Bio</label>
                                    <textarea
                                        className={`${inputClasses} resize-none leading-relaxed`}
                                        rows={4}
                                        value={formData.aboutText}
                                        onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className={labelClasses}>Experience Count (e.g. 3+)</label>
                                        <input
                                            className={inputClasses}
                                            value={formData.experienceCount || ''}
                                            placeholder="e.g. 3+"
                                            onChange={(e) => setFormData({ ...formData, experienceCount: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Projects Count (e.g. 20+)</label>
                                        <input
                                            className={inputClasses}
                                            value={formData.projectsCount || ''}
                                            placeholder="e.g. 20+"
                                            onChange={(e) => setFormData({ ...formData, projectsCount: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-neutral-800 flex justify-end">
                                    <button
                                        onClick={handleSaveAbout}
                                        disabled={isSavingAbout}
                                        className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black rounded-3xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-emerald-600/30 uppercase tracking-widest text-xs"
                                    >
                                        <Save size={18} /> {isSavingAbout ? 'Saving About Data...' : 'Save About Data DB'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* EXPERIENCE TAB */}
                        {activeTab === 'experience' && (
                            <ExperienceTab
                                experiences={experiences}
                                setExperiences={setExperiences}
                                loading={expLoading}
                                working={expWorking}
                                setWorking={setExpWorking}
                                isDarkMode={isDarkMode}
                            />
                        )}

                        {/* SKILLS TAB */}
                        {activeTab === 'skills' && (
                            <SkillsTab
                                skills={skills}
                                setSkills={setSkills}
                                loading={skillsLoading}
                                working={skillsWorking}
                                setWorking={setSkillsWorking}
                                isDarkMode={isDarkMode}
                            />
                        )}

                        {/* SERVICES TAB */}
                        {activeTab === 'services' && (
                            <ServiceTab
                                services={services}
                                setServices={setServices}
                                loading={servicesLoading}
                                working={servicesWorking}
                                setWorking={setServicesWorking}
                                isDarkMode={isDarkMode}
                            />
                        )}

                        {/* PROJECTS TAB */}
                        {activeTab === 'projects' && (
                            <ProjectTab
                                projects={projects}
                                setProjects={setProjects}
                                loading={projectsLoading}
                                working={projectsWorking}
                                setWorking={setProjectsWorking}
                                isDarkMode={isDarkMode}
                            />
                        )}

                        {/* MESSAGES TAB */}
                        {activeTab === 'messages' && (
                            <MessagesTab
                                messages={messages}
                                setMessages={setMessages}
                                loading={messagesLoading}
                                working={messagesWorking}
                                setWorking={setMessagesWorking}
                                isDarkMode={isDarkMode}
                            />
                        )}

                        {/* CONTACT TAB */}
                        {activeTab === 'contact' && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className={`text-xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Contact Info Configuration</h3>
                                </div>

                                {contactInfoLoading ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 size={32} className={`animate-spin ${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className={labelClasses}>Email Address</label>
                                            <input
                                                className={inputClasses}
                                                value={contactInfo.email}
                                                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Phone Number</label>
                                            <input
                                                className={inputClasses}
                                                value={contactInfo.phone}
                                                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Work Location</label>
                                            <input
                                                className={inputClasses}
                                                value={contactInfo.location}
                                                onChange={(e) => setContactInfo({ ...contactInfo, location: e.target.value })}
                                            />
                                        </div>

                                        <div className="pt-6 border-t border-neutral-800 flex justify-end">
                                            <button
                                                onClick={handleSaveContactInfo}
                                                disabled={contactInfoWorking}
                                                className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black rounded-3xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-emerald-600/30 uppercase tracking-widest text-xs"
                                            >
                                                {contactInfoWorking ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                                {contactInfoWorking ? 'Saving...' : 'Save Contact Data DB'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                    </div>
                </div>

                {cropModal.isOpen && (
                    <ImageCropper
                        imageSrc={cropModal.src}
                        aspect={cropModal.aspect}
                        onComplete={handleCropComplete}
                        onCancel={handleCropCancel}
                    />
                )}
            </div >
        </div >
    )
}


/* ─────────────────────────────────────────
   ExperienceTab — live API-connected component
───────────────────────────────────────── */
function ExperienceTab({ experiences, setExperiences, loading, working, setWorking, isDarkMode }) {
    const [addingExp, setAddingExp] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({ company: '', role: '', period: '', description: '' })

    const inputClasses = `w-full px-6 py-4 rounded-2xl border text-sm font-bold outline-none transition-all ${isDarkMode
        ? 'bg-neutral-950 border-neutral-800 text-white focus:border-rose-500 placeholder-neutral-600'
        : 'bg-white border-neutral-200 text-neutral-900 focus:border-rose-400 placeholder-neutral-400'
        }`

    const labelClasses = "block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-neutral-500 ml-2"

    const handleAdd = async () => {
        if (!editForm.company || !editForm.role) return toast.error('Company and Role are required')

        const tempId = 'temp-' + Date.now()
        const optimisticItem = { id: tempId, ...editForm }
        const originalState = [...experiences]

        // 1. Immediately update state
        setExperiences(prev => [optimisticItem, ...prev])
        setAddingExp(false)
        const formToSubmit = { ...editForm }
        setEditForm({ company: '', role: '', period: '', description: '' })

        // 2. Fire API in background
        try {
            const created = await experienceApi.create(formToSubmit)
            setExperiences(prev => prev.map(e => e.id === tempId ? created : e))
            toast.success('Experience added!', { id: 'experience-op' })
        } catch (err) {
            setExperiences(originalState)
            toast.error(`Failed to add: ${err.message}`, { id: 'experience-op' })
        }
    }

    const handleUpdate = async (id) => {
        const originalState = [...experiences]
        const formToSubmit = { ...editForm }

        // 1. Immediately update state
        setExperiences(prev => prev.map(e => e.id === id ? { ...e, ...formToSubmit } : e))
        setEditingId(null)

        // 2. Fire API in background
        try {
            const updated = await experienceApi.update(id, formToSubmit)
            setExperiences(prev => prev.map(e => e.id === id ? updated : e))
            toast.success('Experience updated!', { id: 'experience-op' })
        } catch (err) {
            setExperiences(originalState)
            toast.error(`Failed to update: ${err.message}`, { id: 'experience-op' })
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this experience?')) return
        const originalState = [...experiences]

        // 1. Immediately update state
        setExperiences(prev => prev.filter(e => e.id !== id))

        // 2. Fire API in background
        try {
            await experienceApi.delete(id)
            toast.success('Experience deleted!', { id: 'experience-op' })
        } catch (err) {
            setExperiences(originalState)
            toast.error(`Failed to delete: ${err.message}`, { id: 'experience-op' })
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-neutral-500 font-bold text-sm uppercase tracking-widest">Loading experiences...</p>
            </div>
        )
    }

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <h3 className={`text-xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-neutral-900'
                    }`}>Work History</h3>
                {!addingExp && (
                    <button
                        onClick={() => {
                            setAddingExp(true)
                            setEditForm({ company: '', role: '', period: '', description: '' })
                        }}
                        className={`px-6 py-3 border rounded-xl text-rose-500 font-bold text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all ${isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-200'
                            }`}
                    >
                        <Plus size={14} className="inline mr-2" /> Add Experience
                    </button>
                )}
            </div>

            {(addingExp || editingId) && (
                <div className={`p-8 rounded-[40px] border space-y-6 ${isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-200 shadow-2xl'
                    }`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>Company</label>
                            <input
                                className={inputClasses}
                                value={editForm.company}
                                onChange={e => setEditForm({ ...editForm, company: e.target.value })}
                                placeholder="Google, Meta, etc."
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Role</label>
                            <input
                                className={inputClasses}
                                value={editForm.role}
                                onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                                placeholder="Full Stack Developer"
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Period</label>
                            <input
                                className={inputClasses}
                                value={editForm.period}
                                onChange={e => setEditForm({ ...editForm, period: e.target.value })}
                                placeholder="2022 - Present"
                            />
                        </div>
                    </div>
                    <div>
                        <label className={labelClasses}>Description</label>
                        <textarea
                            className={`${inputClasses} h-32 resize-none`}
                            value={editForm.description}
                            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                            placeholder="Describe your impact and responsibilities..."
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => { setAddingExp(false); setEditingId(null) }}
                            className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest ${isDarkMode ? 'text-neutral-500 hover:text-white' : 'text-neutral-400 hover:text-neutral-900'
                                }`}
                        >Cancel</button>
                        <button
                            onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
                            disabled={working}
                            className="px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 text-xs uppercase tracking-widest"
                        >
                            {working ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            {editingId ? 'Update Experience' : 'Save Experience'}
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {experiences.map(exp => (
                    <div
                        key={exp.id}
                        className={`group relative p-8 rounded-[40px] border transition-all ${isDarkMode ? 'bg-neutral-950 border-neutral-800 hover:border-neutral-700' : 'bg-white border-neutral-200 hover:border-neutral-300'
                            }`}
                    >
                        <div className="flex flex-col md:flex-row md:items-center gap-8">
                            <div className="md:w-1/4">
                                <p className="text-rose-500 font-black tracking-widest text-xs uppercase">{exp.period}</p>
                            </div>
                            <div className="md:w-1/4">
                                <h4 className={`text-xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{exp.company}</h4>
                                <p className="text-neutral-500 font-bold text-sm tracking-tight">{exp.role}</p>
                            </div>
                            <div className="flex-1">
                                <p className={`text-sm italic leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>"{exp.description}"</p>
                            </div>
                        </div>

                        <div className="absolute top-6 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => {
                                    setEditingId(exp.id)
                                    setEditForm({ ...exp })
                                    setAddingExp(false)
                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                }}
                                className="p-2 text-neutral-500 hover:text-rose-500 transition-colors"
                            >
                                <Upload size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(exp.id)}
                                className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                {experiences.length === 0 && !addingExp && (
                    <p className="text-center py-12 text-neutral-500 font-bold uppercase text-xs tracking-[0.2em]">No work history recorded.</p>
                )}
            </div>
        </div>
    )
}


/* ─────────────────────────────────────────
   ProjectTab — live API-connected component
───────────────────────────────────────── */
function ProjectTab({ projects, setProjects, loading, working, setWorking, isDarkMode }) {
    const [adding, setAdding] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({ title: '', description: '', tags: '', image: '' })
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [cropModal, setCropModal] = useState({ isOpen: false, src: null, aspect: 16 / 9 })

    const inputClasses = `w-full px-6 py-4 rounded-2xl border text-sm font-bold outline-none transition-all ${isDarkMode
        ? 'bg-neutral-950 border-neutral-800 text-white focus:border-rose-500 placeholder-neutral-600'
        : 'bg-white border-neutral-200 text-neutral-900 focus:border-rose-400 placeholder-neutral-400'
        }`

    const labelClasses = "block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-neutral-500 ml-2"

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setCropModal({ isOpen: true, src: URL.createObjectURL(file), aspect: 16 / 9 })
            e.target.value = null
        }
    }

    const handleCropComplete = (croppedFile) => {
        setImageFile(croppedFile)
        setImagePreview(URL.createObjectURL(croppedFile))
        setCropModal({ isOpen: false, src: null, aspect: 16 / 9 })
    }

    const handleCropCancel = () => {
        setCropModal({ isOpen: false, src: null, aspect: 16 / 9 })
    }

    const resetForm = () => {
        setAdding(false)
        setEditingId(null)
        setEditForm({ title: '', description: '', tags: '', image: '' })
        setImageFile(null)
        setImagePreview(null)
    }

    const handleSubmit = async () => {
        if (!editForm.title || !editForm.description) return toast.error('Title and Description required')

        const isEditing = !!editingId

        const tempId = 'temp-' + Date.now()
        const tagsArray = editForm.tags ? editForm.tags.split(',').map(t => t.trim()) : []
        const imageUrl = imagePreview || editForm.image_url || editForm.image || ''

        const optimisticItem = {
            id: editingId || tempId,
            title: editForm.title,
            description: editForm.description,
            tags: tagsArray,
            image_url: imageUrl,
            image: imageUrl
        }

        const originalState = [...projects]
        const activeEditingId = editingId

        // 1. Immediately update state
        if (isEditing) {
            setProjects(prev => prev.map(p => p.id === activeEditingId ? { ...p, ...optimisticItem } : p))
        } else {
            setProjects(prev => [optimisticItem, ...prev])
        }

        // Prepare FormData
        const fd = new FormData()
        fd.append('title', editForm.title)
        fd.append('description', editForm.description)
        fd.append('tags', editForm.tags)
        if (imageFile) fd.append('image', imageFile)

        resetForm()

        // 2. Fire API in background
        try {
            if (isEditing) {
                const updated = await projectsApi.update(activeEditingId, fd)
                setProjects(prev => prev.map(p => p.id === activeEditingId ? updated : p))
                toast.success('Project updated!', { id: 'project-op' })
            } else {
                const created = await projectsApi.create(fd)
                setProjects(prev => prev.map(p => p.id === tempId ? created : p))
                toast.success('Project created!', { id: 'project-op' })
            }
        } catch (err) {
            setProjects(originalState)
            toast.error(`Error: ${err.message}`, { id: 'project-op' })
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this project?')) return
        const originalState = [...projects]

        // 1. Immediately update state
        setProjects(prev => prev.filter(p => p.id !== id))

        // 2. Fire API in background
        try {
            await projectsApi.delete(id)
            toast.success('Project deleted!', { id: 'project-op' })
        } catch (err) {
            setProjects(originalState)
            toast.error(`Failed to delete: ${err.message}`, { id: 'project-op' })
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-neutral-500 font-bold text-sm uppercase tracking-widest">Loading projects...</p>
            </div>
        )
    }

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <h3 className={`text-xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Projects</h3>
                {!adding && !editingId && (
                    <button
                        onClick={() => setAdding(true)}
                        className={`px-6 py-3 border rounded-xl text-rose-500 font-bold text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all ${isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-200'}`}
                    >
                        <Plus size={14} className="inline mr-2" /> New Project
                    </button>
                )}
            </div>

            {(adding || editingId) && (
                <div className={`p-8 rounded-[40px] border grid grid-cols-1 md:grid-cols-3 gap-8 ${isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-200 shadow-2xl'}`}>
                    <div className="md:col-span-1 space-y-4">
                        <label className={labelClasses}>Project Image</label>
                        <div className="relative aspect-video rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 group/img">
                            {/* imagePreview = blob URL while file chosen; editForm.image_url or editForm.image = Supabase URL from saved record */}
                            {(imagePreview || editForm.image_url || editForm.image) ? (
                                <img src={imagePreview || editForm.image_url || editForm.image} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-600"><Camera size={32} /></div>
                            )}
                            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer">
                                <Upload className="text-white" />
                                <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
                            </label>
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <label className={labelClasses}>Title</label>
                            <input className={inputClasses} value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Project name" />
                        </div>
                        <div>
                            <label className={labelClasses}>Tags (comma separated)</label>
                            <input className={inputClasses} value={editForm.tags || ''} onChange={e => setEditForm({ ...editForm, tags: e.target.value })} placeholder="React, Tailwind, Node.js" />
                        </div>
                        <div>
                            <label className={labelClasses}>Description</label>
                            <textarea className={`${inputClasses} h-32 resize-none`} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} placeholder="Project details..." />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button onClick={resetForm} className="text-neutral-500 hover:text-white uppercase font-black tracking-widest text-[10px]">Cancel</button>
                            <button onClick={handleSubmit} disabled={working} className="px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 text-xs uppercase tracking-widest">
                                {working ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {editingId ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {projects.map(proj => (
                    <div key={proj.id} className={`group relative p-8 rounded-[40px] border transition-all ${isDarkMode ? 'bg-neutral-950 border-neutral-800 hover:border-neutral-700' : 'bg-white border-neutral-200 hover:border-neutral-300'}`}>
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            {/* image_url or image is the Supabase public URL returned by the backend */}
                            <img src={proj.image_url || proj.image || 'https://placehold.co/400x225'} className="w-48 aspect-video rounded-3xl object-cover" onError={(e) => e.target.src = 'https://placehold.co/400x225'} />
                            <div className="flex-1 space-y-2">
                                <h4 className={`text-xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{proj.title}</h4>
                                <div className="flex gap-2 flex-wrap">
                                    {(Array.isArray(proj.tags) ? proj.tags : []).map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest">{tag}</span>
                                    ))}
                                </div>
                                <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2">{proj.description}</p>
                            </div>
                        </div>
                        <div className="absolute top-6 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => {
                                setEditingId(proj.id)
                                // Spread full project so image_url is available for preview in form
                                setEditForm({ ...proj, tags: Array.isArray(proj.tags) ? proj.tags.join(', ') : '' })
                                setAdding(false)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }} className="p-2 text-neutral-500 hover:text-rose-500"><Upload size={18} /></button>
                            <button onClick={() => handleDelete(proj.id)} className="p-2 text-neutral-500 hover:text-red-500"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && !adding && <p className="text-center py-12 text-neutral-500 font-bold uppercase text-xs tracking-[0.2em]">No projects yet.</p>}
            </div>

            {cropModal.isOpen && (
                <ImageCropper
                    imageSrc={cropModal.src}
                    aspect={cropModal.aspect}
                    onComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </div>
    )
}

/* ─────────────────────────────────────────
   ServiceTab — live API-connected component
───────────────────────────────────────── */
function ServiceTab({ services, setServices, loading, working, setWorking, isDarkMode }) {
    const [adding, setAdding] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({ title: '', description: '' })

    const inputClasses = `w-full px-6 py-4 rounded-2xl border text-sm font-bold outline-none transition-all ${isDarkMode
        ? 'bg-neutral-950 border-neutral-800 text-white focus:border-rose-500 placeholder-neutral-600'
        : 'bg-white border-neutral-200 text-neutral-900 focus:border-rose-400 placeholder-neutral-400'
        }`

    const labelClasses = "block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-neutral-500 ml-2"

    const resetForm = () => {
        setAdding(false)
        setEditingId(null)
        setEditForm({ title: '', description: '' })
    }

    const handleSubmit = async () => {
        if (!editForm.title || !editForm.description) return toast.error('Title and Description are required')

        const isEditing = !!editingId

        const tempId = 'temp-' + Date.now()
        const optimisticItem = {
            id: editingId || tempId,
            title: editForm.title,
            description: editForm.description
        }

        const originalState = [...services]
        const isEditingCheck = !!editingId
        const activeEditingId = editingId
        const formToSubmit = { ...editForm }

        // 1. Immediately update state
        if (isEditingCheck) {
            setServices(prev => prev.map(s => s.id === activeEditingId ? optimisticItem : s))
        } else {
            setServices(prev => [...prev, optimisticItem])
        }

        resetForm()

        // 2. Fire API in background
        try {
            if (isEditingCheck) {
                const updated = await serviceApi.update(activeEditingId, formToSubmit)
                setServices(prev => prev.map(s => s.id === activeEditingId ? updated : s))
                toast.success('Service updated!', { id: 'service-op' })
            } else {
                const created = await serviceApi.create(formToSubmit)
                setServices(prev => prev.map(s => s.id === tempId ? created : s))
                toast.success('Service added!', { id: 'service-op' })
            }
        } catch (err) {
            setServices(originalState)
            toast.error(`Error: ${err.message}`, { id: 'service-op' })
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this service?')) return
        const originalState = [...services]

        // 1. Immediately update state
        setServices(prev => prev.filter(s => s.id !== id))

        // 2. Fire API in background
        try {
            await serviceApi.delete(id)
            toast.success('Service deleted!', { id: 'service-op' })
        } catch (err) {
            setServices(originalState)
            toast.error(`Failed to delete: ${err.message}`, { id: 'service-op' })
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-neutral-500 font-bold text-sm uppercase tracking-widest">Loading services...</p>
            </div>
        )
    }

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <h3 className={`text-xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>My Offerings</h3>
                {!adding && !editingId && (
                    <button
                        onClick={() => setAdding(true)}
                        className={`px-6 py-3 border rounded-xl text-rose-500 font-bold text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all ${isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-200'}`}
                    >
                        <Plus size={14} className="inline mr-2" /> Add Service
                    </button>
                )}
            </div>

            {(adding || editingId) && (
                <div className={`p-8 rounded-[40px] border space-y-6 ${isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-200 shadow-2xl'}`}>
                    <div>
                        <label className={labelClasses}>Service Title</label>
                        <input
                            className={inputClasses}
                            value={editForm.title}
                            onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                            placeholder="e.g. Web Development"
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>Description</label>
                        <textarea
                            className={`${inputClasses} h-32 resize-none`}
                            value={editForm.description}
                            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                            placeholder="Describe what you offer..."
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button onClick={resetForm} className="text-neutral-500 hover:text-white uppercase font-black tracking-widest text-[10px]">Cancel</button>
                        <button
                            onClick={handleSubmit}
                            disabled={working}
                            className="px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 text-xs uppercase tracking-widest"
                        >
                            {working ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            {editingId ? 'Update Service' : 'Save Service'}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {services.map(service => (
                    <div
                        key={service.id}
                        className={`group relative p-8 rounded-[40px] border transition-all ${isDarkMode ? 'bg-neutral-950 border-neutral-800 hover:border-neutral-700' : 'bg-white border-neutral-200 hover:border-neutral-300'}`}
                    >
                        <div className="flex-1 space-y-2">
                            <h4 className={`text-xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{service.title}</h4>
                            <p className={`text-sm italic leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>{service.description}</p>
                        </div>
                        <div className="absolute top-6 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => {
                                    setEditingId(service.id)
                                    setEditForm({ title: service.title, description: service.description })
                                    setAdding(false)
                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                }}
                                className="p-2 text-neutral-500 hover:text-rose-500 transition-colors"
                            >
                                <Upload size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(service.id)}
                                className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                {services.length === 0 && !adding && <p className="text-center py-12 text-neutral-500 font-bold uppercase text-xs tracking-[0.2em]">No services recorded.</p>}
            </div>
        </div>
    )
}

export default Dashboard


/* ─────────────────────────────────────────
   SkillsTab — live API-connected component
───────────────────────────────────────── */
function SkillsTab({ skills, setSkills, loading, working, setWorking, isDarkMode }) {
    // Local state for new category input
    const [newCatName, setNewCatName] = useState('')
    const [addingCat, setAddingCat] = useState(false)
    // Per-category new item input { [categoryId]: string }
    const [newItemInputs, setNewItemInputs] = useState({})

    const inputCls = `bg-transparent text-lg font-black uppercase tracking-tight outline-none w-full ${isDarkMode ? 'text-white' : 'text-neutral-900'
        }`

    // Add a new category
    const handleAddCategory = async () => {
        const name = newCatName.trim()
        if (!name) return

        const tempId = 'temp-' + Date.now()
        const optimisticCategory = {
            id: tempId,
            category: name,
            items: []
        }
        const originalState = [...skills]

        // 1. Immediately update state
        setSkills(prev => [...prev, optimisticCategory])
        setNewCatName('')
        setAddingCat(false)

        // 2. Fire API in background
        try {
            const created = await skillsApi.createCategory({ category: name, items: [] })
            setSkills(prev => prev.map(c => c.id === tempId ? created : c))
            toast.success(`Category "${name}" created!`, { id: 'skills-op' })
        } catch (err) {
            setSkills(originalState)
            toast.error(`Failed to create category: ${err.message}`, { id: 'skills-op' })
        }
    }

    // Rename a category on blur
    const handleRenameCategory = async (cat, newName) => {
        const trimmedNewName = newName.trim()
        if (!trimmedNewName || trimmedNewName === cat.category) return

        const originalState = [...skills]

        // 1. Immediately update state
        setSkills(prev => prev.map(c => c.id === cat.id ? { ...c, category: trimmedNewName } : c))

        // 2. Fire API in background
        try {
            const updated = await skillsApi.updateCategory(cat.id, { category: trimmedNewName })
            setSkills(prev => prev.map(c => c.id === cat.id ? { ...c, category: updated.category } : c))
            toast.success('Category renamed!', { id: 'skills-op' })
        } catch (err) {
            setSkills(originalState)
            toast.error(`Failed to rename: ${err.message}`, { id: 'skills-op' })
        }
    }

    // Delete a whole category
    const handleDeleteCategory = async (catId) => {
        if (!confirm('Delete this category and all its skills?')) return

        const originalState = [...skills]

        // 1. Immediately update state
        setSkills(prev => prev.filter(c => c.id !== catId))

        // 2. Fire API in background
        try {
            await skillsApi.deleteCategory(catId)
            toast.success('Category deleted!', { id: 'skills-op' })
        } catch (err) {
            setSkills(originalState)
            toast.error(`Failed to delete: ${err.message}`, { id: 'skills-op' })
        }
    }

    // Add a skill item to a category
    const handleAddItem = async (catId) => {
        const name = (newItemInputs[catId] || '').trim()
        if (!name) return

        const tempId = 'temp-item-' + Date.now()
        const optimisticItem = { id: tempId, name }
        const originalState = [...skills]

        // 1. Immediately update state
        setSkills(prev => prev.map(c =>
            c.id === catId ? { ...c, items: [...c.items, optimisticItem] } : c
        ))
        setNewItemInputs(prev => ({ ...prev, [catId]: '' }))

        // 2. Fire API in background
        try {
            const updatedCategory = await skillsApi.addItem(catId, { name })
            setSkills(prev => prev.map(c =>
                c.id === catId ? updatedCategory : c
            ))
            toast.success(`"${name}" added!`, { id: 'skills-op' })
        } catch (err) {
            setSkills(originalState)
            toast.error(`Failed to add skill: ${err.message}`, { id: 'skills-op' })
        }
    }

    // Delete a skill item
    const handleDeleteItem = async (catId, itemId) => {
        const originalState = [...skills]

        // 1. Immediately update state
        setSkills(prev => prev.map(c =>
            c.id === catId ? { ...c, items: c.items.filter(i => i.id !== itemId) } : c
        ))

        // 2. Fire API in background
        try {
            await skillsApi.deleteItem(catId, itemId)
            toast.success('Skill removed!', { id: 'skills-op' })
        } catch (err) {
            setSkills(originalState)
            toast.error(`Failed to remove skill: ${err.message}`, { id: 'skills-op' })
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-neutral-500 font-bold text-sm uppercase tracking-widest">Loading skills...</p>
            </div>
        )
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className={`text-xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-neutral-900'
                    }`}>Technology Stack</h3>
                {addingCat ? (
                    <div className="flex items-center gap-2">
                        <input
                            autoFocus
                            value={newCatName}
                            onChange={e => setNewCatName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                            placeholder="Category name…"
                            className={`px-4 py-2 rounded-xl border text-sm font-bold outline-none focus:border-rose-500 ${isDarkMode
                                ? 'bg-neutral-950 border-neutral-700 text-white placeholder-neutral-600'
                                : 'bg-white border-neutral-300 text-neutral-900 placeholder-neutral-400'
                                }`}
                        />
                        <button
                            onClick={handleAddCategory}
                            disabled={working}
                            className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-widest rounded-xl disabled:opacity-50 transition-all"
                        >
                            {working ? <Loader2 size={14} className="animate-spin" /> : 'Save'}
                        </button>
                        <button
                            onClick={() => { setAddingCat(false); setNewCatName('') }}
                            className="px-4 py-2 border border-neutral-700 text-neutral-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                        >Cancel</button>
                    </div>
                ) : (
                    <button
                        onClick={() => setAddingCat(true)}
                        disabled={working}
                        className={`px-6 py-3 border rounded-xl text-rose-500 font-bold text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2 ${isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-200'
                            }`}
                    >
                        <Plus size={14} /> Add Category
                    </button>
                )}
            </div>

            {/* Category cards */}
            {skills.length === 0 ? (
                <p className="text-center text-neutral-500 py-12 font-bold">No skill categories yet. Add one above!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {skills.map(cat => (
                        <div
                            key={cat.id}
                            className={`border rounded-3xl p-6 ${isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-200 shadow-lg'
                                }`}
                        >
                            {/* Category name (rename on blur) */}
                            <div className="flex justify-between items-center mb-6">
                                <input
                                    defaultValue={cat.category}
                                    onBlur={e => handleRenameCategory(cat, e.target.value)}
                                    className={inputCls}
                                />
                                <button
                                    onClick={() => handleDeleteCategory(cat.id)}
                                    disabled={working}
                                    className="text-neutral-600 hover:text-red-500 transition-colors disabled:opacity-40 ml-2 flex-shrink-0"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>

                            {/* Skill items */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {cat.items.map(item => (
                                    <div
                                        key={item.id}
                                        className={`border px-3 py-1.5 rounded-lg flex items-center gap-2 ${isDarkMode
                                            ? 'bg-neutral-900 border-neutral-800'
                                            : 'bg-neutral-50 border-neutral-200'
                                            }`}
                                    >
                                        <span className={`text-xs font-bold ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
                                            }`}>{item.name}</span>
                                        <button
                                            onClick={() => handleDeleteItem(cat.id, item.id)}
                                            disabled={working}
                                            className="text-neutral-600 hover:text-rose-500 disabled:opacity-40"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add skill input */}
                            <div className="flex gap-2">
                                <input
                                    value={newItemInputs[cat.id] || ''}
                                    onChange={e => setNewItemInputs(prev => ({ ...prev, [cat.id]: e.target.value }))}
                                    onKeyDown={e => e.key === 'Enter' && handleAddItem(cat.id)}
                                    placeholder="New skill…"
                                    className={`flex-1 px-4 py-2 rounded-xl border text-xs font-bold outline-none focus:border-rose-500 ${isDarkMode
                                        ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-600'
                                        : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400'
                                        }`}
                                />
                                <button
                                    onClick={() => handleAddItem(cat.id)}
                                    disabled={working || !newItemInputs[cat.id]?.trim()}
                                    className={`px-4 py-2 rounded-xl border text-rose-500 font-bold text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all disabled:opacity-40 flex items-center gap-1 ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                                        }`}
                                >
                                    <Plus size={12} /> Add
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

/* ─────────────────────────────────────────
   MessagesTab — live API-connected component
───────────────────────────────────────── */
function MessagesTab({ messages, setMessages, loading, working, setWorking, isDarkMode }) {

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this message?")) return;
        const originalState = [...messages]

        // 1. Immediately update state
        setMessages(prev => prev.filter(m => m.id !== id))

        // 2. Fire API in background
        try {
            await contactApi.deleteMessage(id)
            toast.success('Message deleted', { id: 'message-op' })
        } catch (err) {
            setMessages(originalState)
            toast.error('Failed to delete message', { id: 'message-op' })
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center p-20">
                <Loader2 className={`animate-spin ${isDarkMode ? 'text-white' : 'text-neutral-900'}`} size={32} />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h3 className={`text-xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Inbox Messages</h3>

            {messages.length === 0 ? (
                <p className="text-center text-neutral-500 py-12 font-bold">No messages found. Inbox is empty!</p>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`p-8 border rounded-3xl group relative ${isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-200 shadow-md'
                            }`}>

                            <button
                                onClick={() => handleDelete(msg.id)}
                                disabled={working}
                                className="absolute top-8 right-8 text-neutral-400 hover:text-rose-500 disabled:opacity-50 transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>

                            <div className="mb-4 pr-12">
                                <h4 className={`text-xl font-black mb-1 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{msg.subject || 'No Subject'}</h4>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
                                    <span>From: {msg.name}</span>
                                    <span>&bull;</span>
                                    <span className="text-rose-500 lowercase">{msg.email}</span>
                                    <span>&bull;</span>
                                    <span>{new Date(msg.created_at).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className={`p-6 rounded-2xl italic leading-relaxed text-sm ${isDarkMode ? 'bg-neutral-900 text-neutral-400' : 'bg-neutral-50 text-neutral-600'}`}>
                                "{msg.message}"
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
