import { motion } from 'framer-motion'
import { X, Key } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { authApi } from '../api/api'

const Login = ({ onClose, onSuccess, isDarkMode }) => {
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()

        if (!password.trim()) {
            toast.error('Please enter a password')
            return
        }

        toast.info('Authorizing access...', { id: 'login-toast' })
        try {
            setIsLoading(true)

            const data = await authApi.login(password)

            // Store the token in localStorage
            localStorage.setItem('admin_token', data.access_token)

            toast.success('Login successful!', { id: 'login-toast' })
            onSuccess(data.access_token)

        } catch (error) {
            toast.error(error.message || 'Failed to login', { id: 'login-toast' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className={`border p-8 md:p-12 rounded-[40px] md:rounded-[50px] shadow-2xl relative w-full max-w-lg overflow-hidden text-center md:text-left ${isDarkMode
                    ? 'bg-neutral-900 border-neutral-800'
                    : 'bg-white border-neutral-200'
                    }`}
            >
                <div className="absolute top-0 right-0 p-6 md:p-8">
                    <button onClick={onClose} className={`transition-colors ${isDarkMode ? 'text-neutral-700 hover:text-white' : 'text-neutral-400 hover:text-neutral-900'}`}>
                        <X size={24} />
                    </button>
                </div>

                <div className="mb-10 inline-block p-5 bg-rose-600/10 rounded-3xl text-rose-500 mx-auto md:mx-0">
                    <Key size={32} />
                </div>

                <h2 className={`text-3xl md:text-4xl font-black mb-4 uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>System <span className="text-rose-500">Access</span></h2>
                <p className={`font-bold mb-10 text-sm md:text-base ${isDarkMode ? 'text-neutral-500' : 'text-neutral-600'}`}>Please enter your authorized credentials to manage the portfolio system.</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-neutral-600 mb-4 uppercase tracking-[0.2em]">Security Key</label>
                        <input
                            type="password"
                            autoFocus
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full border-2 rounded-2xl px-6 py-5 focus:outline-none focus:border-rose-600 transition-all font-black tracking-[0.5em] text-center ${isDarkMode
                                ? 'bg-neutral-950 border-neutral-800 text-white'
                                : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                                }`}
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed py-6 rounded-3xl font-black transition-all active:scale-95 shadow-2xl shadow-rose-600/30 uppercase tracking-[0.2em] text-xs text-white"
                    >
                        {isLoading ? 'Authorizing...' : 'Authorize Access'}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}

export default Login
