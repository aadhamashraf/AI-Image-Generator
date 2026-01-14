import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'
import ImageGenerator from './components/ImageGenerator'
import ImageGallery from './components/ImageGallery'
import PromptSuggestions from './components/PromptSuggestions'

function App() {
    const [models, setModels] = useState([])
    const [images, setImages] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadInitialData()
    }, [])

    const loadInitialData = async () => {
        try {
            const [modelsRes, historyRes, statsRes] = await Promise.all([
                axios.get('/api/models'),
                axios.get('/api/history'),
                axios.get('/api/stats')
            ])

            setModels(modelsRes.data)
            setImages(historyRes.data.images)
            setStats(statsRes.data)
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleImageGenerated = (newImage) => {
        setImages([newImage, ...images])
        if (stats) {
            setStats({
                ...stats,
                total_images_generated: stats.total_images_generated + 1
            })
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
                <div className="text-center">
                    <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
                    <p className="mt-md" style={{ color: 'var(--color-text-secondary)' }}>
                        Loading AI Models...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', padding: 'var(--spacing-xl)' }}>
            {/* Header */}
            <header className="text-center mb-xl animate-slide-in">
                <h1
                    className="text-gradient"
                    style={{
                        fontSize: 'var(--font-size-4xl)',
                        fontWeight: 800,
                        marginBottom: 'var(--spacing-md)'
                    }}
                >
                    AI Image Generator
                </h1>
                <p style={{
                    fontSize: 'var(--font-size-lg)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    Generate stunning images with different AI models
                </p>

                {/* Stats Bar */}
                {stats && (
                    <div className="flex justify-center gap-lg" style={{ flexWrap: 'wrap' }}>
                        <div className="glass-card p-md" style={{ minWidth: '150px' }}>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
                                {stats.total_models}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                                AI Models
                            </div>
                        </div>
                        <div className="glass-card p-md" style={{ minWidth: '150px' }}>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-accent)' }}>
                                {stats.total_images_generated}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                                Images Generated
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Prompt Suggestions */}
                <div className="mb-xl animate-slide-in" style={{ animationDelay: '100ms' }}>
                    <PromptSuggestions />
                </div>

                {/* Image Generator */}
                <div className="mb-xl animate-slide-in" style={{ animationDelay: '200ms' }}>
                    <ImageGenerator
                        models={models}
                        onImageGenerated={handleImageGenerated}
                    />
                </div>

                {/* Image Gallery */}
                <div className="animate-slide-in" style={{ animationDelay: '300ms' }}>
                    <ImageGallery images={images} />
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center mt-xl" style={{ padding: 'var(--spacing-xl) 0' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                    Powered by Hugging Face Inference API • {stats?.total_models || 3}+ AI Models
                </p>
            </footer>
        </div>
    )
}

export default App
