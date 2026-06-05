import { useEffect, useRef } from 'react'

const ParticlesBackground = ({ isDarkMode }) => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        let animationFrameId
        let w, h

        const particles = []
        // Increased count significantly for denser effect
        const particleCount = 70
        const connectionDistance = 100

        // Resize handler
        const handleResize = () => {
            if (canvas && canvas.parentElement) {
                w = canvas.width = canvas.parentElement.offsetWidth
                h = canvas.height = canvas.parentElement.offsetHeight
            }
        }

        // Initialize particles
        const initParticles = () => {
            particles.length = 0
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1
                })
            }
        }

        handleResize()
        initParticles()
        const mouse = { x: null, y: null, radius: 200 }

        window.addEventListener('mousemove', (e) => {
            if (canvas) {
                const rect = canvas.getBoundingClientRect()
                mouse.x = e.clientX - rect.left
                mouse.y = e.clientY - rect.top
            }
        })

        window.addEventListener('mouseleave', () => {
            mouse.x = null
            mouse.y = null
        })

        window.addEventListener('click', (e) => {
            if (canvas) {
                const rect = canvas.getBoundingClientRect()
                const clickX = e.clientX - rect.left
                const clickY = e.clientY - rect.top

                // Add 5 new particles at click location
                for (let i = 0; i < 5; i++) {
                    particles.push({
                        x: clickX,
                        y: clickY,
                        vx: (Math.random() - 0.5) * 2, // Faster initial speed
                        vy: (Math.random() - 0.5) * 2,
                        size: Math.random() * 2 + 1
                    })
                }
            }
        })

        const animate = () => {
            ctx.clearRect(0, 0, w, h)

            particles.forEach((p, i) => {
                p.x += p.vx
                p.y += p.vy

                // Wrap around screen
                if (p.x < 0) p.x = w
                if (p.x > w) p.x = 0
                if (p.y < 0) p.y = h
                if (p.y > h) p.y = 0

                // Draw Particle
                const color = isDarkMode ? '134, 239, 172' : '22, 163, 74'

                ctx.fillStyle = `rgba(${color}, 0.9)`
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()

                // Connect to Mouse
                if (mouse.x != null) {
                    const dx = p.x - mouse.x
                    const dy = p.y - mouse.y
                    const distance = Math.sqrt(dx * dx + dy * dy)
                    if (distance < mouse.radius) {
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(${color}, ${0.8 * (1 - distance / mouse.radius)})`
                        ctx.lineWidth = 1.5
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(mouse.x, mouse.y)
                        ctx.stroke()
                    }
                }

                // Draw Connections
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j]
                    const dx = p.x - p2.x
                    const dy = p.y - p2.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < connectionDistance) {
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(${color}, ${0.5 * (1 - distance / connectionDistance)})`
                        ctx.lineWidth = 1.5
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(p2.x, p2.y)
                        ctx.stroke()
                    }
                }
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [isDarkMode])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none -z-0"
            style={{ opacity: 1 }} // Full opacity
        />
    )
}

export default ParticlesBackground
