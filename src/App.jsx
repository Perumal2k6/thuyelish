import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Services from './sections/Services'
import About from './sections/About'
import Skills from './sections/Skills'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Contact from './sections/Contact'
import Footer from './components/Footer'
import Dashboard from './sections/Dashboard'
import Login from './components/Login'
import ParticlesBackground from './components/ParticlesBackground'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut } from 'lucide-react'
import { serviceApi, contactInfoApi } from './api/api'
import { Toaster, toast } from 'sonner'
import { useState, useEffect } from 'react'

// Initial Data matched to your previous requests
const INITIAL_DATA = {
  // Counters and Stats
  experienceCount: "5+",
  projectsCount: "50+",

  // Profile / Hero
  name: "",
  heroTitle: "",
  resumeLink: "",

  // About
  aboutTitle: "",
  aboutText: "",

  // Skills
  skills: [
    { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
    { category: "Backend", items: ["Node.js", "Express", "Python", "FastAPI"] },
    { category: "Database", items: ["PostgreSQL", "MongoDB", "Redis", "Firebase"] },
    { category: "Tools", items: ["Git", "Docker", "AWS", "Vite"] }
  ],
  projects: [
    {
      id: 1,
      title: "SaaS Dashboard",
      description: "A comprehensive dashboard for managing marketing campaigns and analytics.",
      image: "https://images.unsplash.com/photo-1551288049-bbbda5366fd5?auto=format&fit=crop&q=80&w=800",
      tags: ["React", "Charts", "Tailwind"],
    },
    {
      id: 2,
      title: "Watch E-commerce",
      description: "High-end luxury marketplace with seamless checkout experience.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
      tags: ["Next.js", "Shopify"],
    }
  ]
}

function App() {
  const [isAdmin, setIsAdmin] = useState(() => {
    // Check if user has a valid token on load
    return !!localStorage.getItem('admin_token')
  })
  const [showDashboard, setShowDashboard] = useState(() => {
    return window.location.pathname === '/dashboard' && !!localStorage.getItem('admin_token')
  })
  const [showLogin, setShowLogin] = useState(() => window.location.pathname === '/login')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme ? savedTheme === 'dark' : true // Default to Dark Mode
  })

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newMode = !prev
      localStorage.setItem('theme', newMode ? 'dark' : 'light')
      return newMode
    })
  }

  const [services, setServices] = useState([])
  const [servicesLoading, setServicesLoading] = useState(true)

  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    location: ''
  })
  const [contactInfoLoading, setContactInfoLoading] = useState(true)

  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_data')
      if (saved) {
        const parsed = JSON.parse(saved)

        // Clean up legacy profile data from local storage to free up quota
        delete parsed.name;
        delete parsed.profileImage;
        delete parsed.aboutTitle;
        delete parsed.aboutText;
        delete parsed.resumeLink;
        delete parsed.services;
        delete parsed.contactEmail;
        delete parsed.contactPhone;
        delete parsed.contactLocation;

        // Data Migration: Fix legacy skills array (strings -> objects)
        if (parsed.skills && Array.isArray(parsed.skills) && typeof parsed.skills[0] === 'string') {
          parsed.skills = [
            { category: "My Skills", items: parsed.skills }
          ]
        }

        return { ...INITIAL_DATA, ...parsed }
      }
    } catch (e) {
      console.error("Failed to load data", e)
    }
    return INITIAL_DATA
  })

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/login') {
        setShowLogin(true);
        setShowDashboard(false);
      } else if (path === '/dashboard') {
        if (localStorage.getItem('admin_token')) {
          setShowDashboard(true);
          setShowLogin(false);
        } else {
          window.history.replaceState(null, '', '/login');
          setShowLogin(true);
          setShowDashboard(false);
        }
      } else {
        setShowLogin(false);
        setShowDashboard(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceApi.getAll()
        if (data && Array.isArray(data)) {
          setServices(data)
        }
      } catch (err) {
        console.error("Failed to fetch services:", err)
      } finally {
        setServicesLoading(false)
      }
    }
    fetchServices()
  }, [])

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const info = await contactInfoApi.getContact()
        if (info) {
          setContactInfo({
            email: info.email || '',
            phone: info.phone || '',
            location: info.location || ''
          })
        }
      } catch (err) {
        console.error("Failed to fetch contact info:", err)
      } finally {
        setContactInfoLoading(false)
      }
    }
    fetchContactInfo()
  }, [])

  useEffect(() => {
    // Robust saving mechanism
    const saveData = async () => {
      try {
        const json = JSON.stringify(data)
        // Check size before attempting to save (approx 4.5MB limit safe guard)
        if (json.length > 4500000) {
          console.warn("Data size too large to save automatically:", json.length)
          // Only alert if we haven't alerted recently to avoid spamming
          if (!window.hasAlertedSize) {
            alert("Warning: Your portfolio data is becoming too large (likely due to images). Some changes may not assume persistence. Please delete unused images or use smaller ones.")
            window.hasAlertedSize = true
          }
          return
        }

        localStorage.setItem('portfolio_data', json)
      } catch (e) {
        // Explicitly catch QuotaExceededError
        if (e.name === 'QuotaExceededError' || e.code === 22) {
          alert("Storage Limit Exceeded! Your changes cannot be saved because the browser storage is full. Please remove some images or projects.")
        } else {
          console.error("Failed to save data:", e)
        }
      }
    }
    saveData()
  }, [data])

  const handleLoginSuccess = (token) => {
    setIsAdmin(true)
    setShowDashboard(true)
    setShowLogin(false)
    window.history.pushState(null, '', '/dashboard')
  }

  const handleLogout = () => {
    setIsAdmin(false)
    setShowDashboard(false)
    localStorage.removeItem('admin_token')
    toast.success('Logged out successfully')
    if (window.location.pathname === '/dashboard' || window.location.pathname === '/login') {
      window.history.pushState(null, '', '/')
    }
  }

  const updateData = (newData) => {
    setData(prev => ({ ...prev, ...newData }))
  }

  return (
    <div className={`min-h-screen font-sans scroll-smooth relative transition-colors duration-300 ${isDarkMode ? 'bg-neutral-950 text-white selection:bg-rose-500/30' : 'bg-gray-50 text-neutral-900 selection:bg-rose-500/20'}`}>
      <Toaster
        position="top-right"
        theme={isDarkMode ? 'dark' : 'light'}
        toastOptions={{
          classNames: {
            toast: isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900',
            success: isDarkMode ? '!bg-emerald-950/80 !border-emerald-900 !text-emerald-400' : '!bg-emerald-50 !border-emerald-200 !text-emerald-700',
            error: isDarkMode ? '!bg-rose-950/80 !border-rose-900 !text-rose-400' : '!bg-rose-50 !border-rose-200 !text-rose-700',
            info: isDarkMode ? '!bg-blue-950/80 !border-blue-900 !text-blue-400' : '!bg-blue-50 !border-blue-200 !text-blue-700',
            warning: isDarkMode ? '!bg-amber-950/80 !border-amber-900 !text-amber-400' : '!bg-amber-50 !border-amber-200 !text-amber-700',
          }
        }}
      />
      <div className="fixed inset-0 z-0">
        <ParticlesBackground isDarkMode={isDarkMode} />
      </div>

      <div className="relative z-10">
        <Navbar
          isAdmin={isAdmin}
          onLogin={() => {
            setShowLogin(true);
            window.history.pushState(null, '', '/login');
          }}
          onLogout={() => {
            setShowDashboard(true);
            window.history.pushState(null, '', '/dashboard');
          }}
          onNavigate={() => {
            setShowDashboard(false);
            if (window.location.pathname === '/dashboard' || window.location.pathname === '/login') {
              window.history.pushState(null, '', '/');
            }
          }}
          data={data}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />

        {!showDashboard ? (
          <>
            <main>
              <Hero isAdmin={isAdmin} updateData={updateData} isDarkMode={isDarkMode} />
              <Services servicesData={services} isDarkMode={isDarkMode} />
              <About data={data} isAdmin={isAdmin} updateData={updateData} isDarkMode={isDarkMode} />
              <Skills skills={data.skills} isDarkMode={isDarkMode} />
              <Experience isDarkMode={isDarkMode} />
              <Projects projects={data.projects} isAdmin={false} isDarkMode={isDarkMode} />
              <Contact contactData={contactInfo} isDarkMode={isDarkMode} />
            </main>
            <Footer />
          </>
        ) : (
          <Dashboard
            data={data}
            updateData={updateData}
            onBack={() => {
              setShowDashboard(false);
              if (window.location.pathname === '/dashboard') {
                window.history.pushState(null, '', '/');
              }
            }}
            isDarkMode={isDarkMode}
          />
        )}

        {isAdmin && showDashboard && (
          <div className="fixed bottom-8 left-8 z-50">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 px-6 py-4 border rounded-2xl text-rose-500 font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-red-600 hover:text-white transition-all ${isDarkMode
                ? 'bg-neutral-900 border-neutral-800'
                : 'bg-white border-neutral-200'
                }`}
            >
              <LogOut size={16} /> Exit Admin Mode
            </button>
          </div>
        )}

        <AnimatePresence>
          {showLogin && (
            <Login
              isDarkMode={isDarkMode}
              onClose={() => {
                setShowLogin(false);
                if (window.location.pathname === '/login') {
                  window.history.pushState(null, '', '/');
                }
              }}
              onSuccess={handleLoginSuccess}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
