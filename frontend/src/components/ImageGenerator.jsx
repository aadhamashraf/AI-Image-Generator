import { useState } from 'react'
import axios from 'axios'

function ImageGenerator({ models, onImageGenerated }) {
    const [prompt, setPrompt] = useState('')
    const [selectedModel, setSelectedModel] = useState(models.length > 0 ? models[0].id : '')

    // Update selected model when models prop changes
    // This ensures we always have a valid model selected if the initial list was empty
    if (models.length > 0 && !selectedModel) {
        setSelectedModel(models[0].id)
    }
    const [generating, setGenerating] = useState(false)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [showAdvanced, setShowAdvanced] = useState(false)

    // Advanced configuration
    const [config, setConfig] = useState({
        width: 512,
        height: 512,
        num_inference_steps: 20,
        guidance_scale: 7.5,
        negative_prompt: '',
        seed: null
    })

    const filteredModels = models.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.provider.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const selectedModelInfo = models.find(m => m.id === selectedModel)

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt')
            return
        }

        setGenerating(true)
        setError(null)

        try {
            const response = await axios.post('/api/generate', {
                prompt,
                model: selectedModel,
                ...config
            })

            onImageGenerated(response.data)

            // Optionally clear prompt after generation
            // setPrompt('')
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate image')
            console.error('Generation error:', err)
        } finally {
            setGenerating(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleGenerate()
        }
    }

    const randomizeSeed = () => {
        setConfig({ ...config, seed: Math.floor(Math.random() * 1000000) })
    }

    return (
        <div className="glass-card p-xl">
            <h2 style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 700,
                marginBottom: 'var(--spacing-lg)',
                color: 'var(--color-text-primary)'
            }}>
                Generate Image
            </h2>

            {/* Prompt Input */}
            <div className="mb-lg">
                <label className="label">
                    Prompt
                    <span style={{
                        float: 'right',
                        color: 'var(--color-text-muted)',
                        textTransform: 'none',
                        fontSize: 'var(--font-size-xs)'
                    }}>
                        {prompt.length}/1000
                    </span>
                </label>
                <textarea
                    className="textarea"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe the image you want to generate... (Press Enter to generate)"
                    maxLength={1000}
                />
            </div>

            {/* Model Selection */}
            <div className="mb-lg">
                <label className="label">
                    AI Model
                    {selectedModelInfo && (
                        <span style={{
                            float: 'right',
                            textTransform: 'none',
                            fontSize: 'var(--font-size-xs)',
                            fontWeight: 'normal'
                        }}>
                            <span className={`badge badge-${selectedModelInfo.speed === 'very-fast' || selectedModelInfo.speed === 'fast' ? 'success' : 'warning'
                                }`}>
                                {selectedModelInfo.speed}
                            </span>
                            {' '}
                            <span className="badge badge-primary">
                                {selectedModelInfo.style}
                            </span>
                        </span>
                    )}
                </label>

                {/* Model Search */}
                <input
                    type="text"
                    className="input mb-sm"
                    placeholder="Search models by name, style, or provider..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: 'var(--spacing-sm)' }}
                />

                <select
                    className="select"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                >
                    {filteredModels.map((model) => (
                        <option key={model.id} value={model.id}>
                            {model.name} - {model.provider} ({model.style}, {model.quality})
                        </option>
                    ))}
                </select>

                {selectedModelInfo && (
                    <p style={{
                        marginTop: 'var(--spacing-sm)',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-tertiary)',
                        fontStyle: 'italic'
                    }}>
                        Note: {selectedModelInfo.description}
                    </p>
                )}
            </div>

            {/* Advanced Configuration Toggle */}
            <button
                className="btn btn-secondary mb-md"
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{ width: '100%' }}
            >
                {showAdvanced ? 'v' : '>'} Advanced Configuration
            </button>

            {/* Advanced Configuration Panel */}
            {showAdvanced && (
                <div className="glass-card p-lg mb-lg" style={{ background: 'var(--color-bg-secondary)' }}>
                    <div className="grid grid-2 gap-md">
                        {/* Width */}
                        <div>
                            <label className="label">
                                Width: {config.width}px
                            </label>
                            <input
                                type="range"
                                min="128"
                                max="2048"
                                step="64"
                                value={config.width}
                                onChange={(e) => setConfig({ ...config, width: parseInt(e.target.value) })}
                                style={{ width: '100%' }}
                            />
                        </div>

                        {/* Height */}
                        <div>
                            <label className="label">
                                Height: {config.height}px
                            </label>
                            <input
                                type="range"
                                min="128"
                                max="2048"
                                step="64"
                                value={config.height}
                                onChange={(e) => setConfig({ ...config, height: parseInt(e.target.value) })}
                                style={{ width: '100%' }}
                            />
                        </div>

                        {/* Inference Steps */}
                        <div>
                            <label className="label">
                                Inference Steps: {config.num_inference_steps}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                step="1"
                                value={config.num_inference_steps}
                                onChange={(e) => setConfig({ ...config, num_inference_steps: parseInt(e.target.value) })}
                                style={{ width: '100%' }}
                            />
                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                More steps = higher quality, slower generation
                            </p>
                        </div>

                        {/* Guidance Scale */}
                        <div>
                            <label className="label">
                                Guidance Scale: {config.guidance_scale}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                step="0.5"
                                value={config.guidance_scale}
                                onChange={(e) => setConfig({ ...config, guidance_scale: parseFloat(e.target.value) })}
                                style={{ width: '100%' }}
                            />
                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                Higher = more prompt adherence
                            </p>
                        </div>
                    </div>

                    {/* Negative Prompt */}
                    <div className="mt-md">
                        <label className="label">Negative Prompt (Optional)</label>
                        <input
                            type="text"
                            className="input"
                            value={config.negative_prompt}
                            onChange={(e) => setConfig({ ...config, negative_prompt: e.target.value })}
                            placeholder="Things to avoid in the image..."
                        />
                    </div>

                    {/* Seed */}
                    <div className="mt-md flex gap-sm">
                        <div style={{ flex: 1 }}>
                            <label className="label">Seed (Optional)</label>
                            <input
                                type="number"
                                className="input"
                                value={config.seed || ''}
                                onChange={(e) => setConfig({ ...config, seed: e.target.value ? parseInt(e.target.value) : null })}
                                placeholder="Random seed for reproducibility"
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={randomizeSeed}
                            >
                                Random
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-md" style={{
                    padding: 'var(--spacing-md)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-error)'
                }}>
                    Error: {error}
                </div>
            )}

            {/* Generate Button */}
            <button
                className="btn btn-primary btn-large"
                onClick={handleGenerate}
                disabled={generating || !prompt.trim()}
                style={{ width: '100%' }}
            >
                {generating ? (
                    <>
                        <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                        Generating...
                    </>
                ) : (
                    <>
                        Generate Image
                    </>
                )}
            </button>

            {generating && (
                <p className="text-center mt-md animate-pulse" style={{ color: 'var(--color-text-tertiary)' }}>
                    This may take 10-30 seconds depending on the model...
                </p>
            )}
        </div>
    )
}

export default ImageGenerator
