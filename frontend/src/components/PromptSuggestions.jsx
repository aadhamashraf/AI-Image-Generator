const PROMPT_CATEGORIES = [
    {
        name: 'Photorealistic',
        prompts: [
            'A serene lake surrounded by mountains at sunset, photorealistic style',
            'Professional portrait of a person in natural lighting, 8k, highly detailed',
            'Aerial view of a futuristic city at night with neon lights',
            'Close-up of a dewdrop on a flower petal, macro photography',
            'Cozy coffee shop interior with warm lighting and vintage furniture'
        ]
    },
    {
        name: 'Artistic',
        prompts: [
            'Colorful abstract painting with flowing geometric patterns',
            'Van Gogh style painting of a starry night over a modern city',
            'Watercolor illustration of a magical forest with glowing mushrooms',
            'Art deco poster design for a jazz concert, vibrant colors',
            'Minimalist line art portrait, elegant and simple'
        ]
    },
    {
        name: 'Fantasy',
        prompts: [
            'A majestic dragon perched on a crystal mountain peak',
            'Enchanted library with floating books and magical glowing orbs',
            'Ethereal fairy village built into giant mushrooms, bioluminescent',
            'Ancient wizard casting a spell in a mystical forest',
            'Floating islands connected by rainbow bridges in the sky'
        ]
    },
    {
        name: 'Sci-Fi',
        prompts: [
            'Astronaut riding a horse in space, nebula background',
            'Cyberpunk street market with holographic displays and neon signs',
            'Massive spaceship approaching an alien planet with rings',
            'Robot and human shaking hands, symbolizing cooperation',
            'Futuristic laboratory with advanced technology and glowing screens'
        ]
    },
    {
        name: 'Anime',
        prompts: [
            'Anime character with vibrant hair in dynamic action pose',
            'Studio Ghibli style landscape with rolling hills and clouds',
            'Magical girl transformation sequence with sparkles and ribbons',
            'Samurai warrior in traditional armor under cherry blossoms',
            'Cute chibi characters having a tea party in a garden'
        ]
    },
    {
        name: 'Nature',
        prompts: [
            'Majestic waterfall in a lush tropical rainforest',
            'Northern lights dancing over a snowy mountain landscape',
            'Underwater coral reef teeming with colorful fish',
            'Ancient redwood forest with sunbeams filtering through trees',
            'Desert landscape with sand dunes at golden hour'
        ]
    }
]

function PromptSuggestions() {
    const copyToClipboard = (prompt) => {
        navigator.clipboard.writeText(prompt)
        // You could add a toast notification here
    }

    return (
        <div className="glass-card p-xl">
            <h2 style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 700,
                marginBottom: 'var(--spacing-md)',
                color: 'var(--color-text-primary)'
            }}>
                Prompt Suggestions
            </h2>
            <p style={{
                color: 'var(--color-text-tertiary)',
                marginBottom: 'var(--spacing-lg)'
            }}>
                Click any prompt to copy it to your clipboard
            </p>

            <div className="grid grid-2 gap-lg">
                {PROMPT_CATEGORIES.map((category, catIndex) => (
                    <div key={catIndex} className="animate-slide-in" style={{ animationDelay: `${catIndex * 50}ms` }}>
                        <h3 style={{
                            fontSize: 'var(--font-size-lg)',
                            fontWeight: 600,
                            marginBottom: 'var(--spacing-sm)',
                            color: 'var(--color-text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-xs)'
                        }}>
                            <span>{category.name}</span>
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                            {category.prompts.map((prompt, promptIndex) => (
                                <button
                                    key={promptIndex}
                                    onClick={() => copyToClipboard(prompt)}
                                    style={{
                                        padding: 'var(--spacing-sm)',
                                        background: 'var(--color-bg-secondary)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--color-text-secondary)',
                                        fontSize: 'var(--font-size-sm)',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-base)',
                                        fontFamily: 'var(--font-family)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'var(--color-bg-tertiary)'
                                        e.target.style.borderColor = 'var(--color-primary)'
                                        e.target.style.transform = 'translateX(4px)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'var(--color-bg-secondary)'
                                        e.target.style.borderColor = 'var(--color-border)'
                                        e.target.style.transform = 'translateX(0)'
                                    }}
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PromptSuggestions
