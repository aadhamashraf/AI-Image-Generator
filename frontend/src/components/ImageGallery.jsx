import { useState } from 'react'

function ImageGallery({ images }) {
    const [selectedImage, setSelectedImage] = useState(null)

    if (images.length === 0) {
        return (
            <div className="glass-card p-xl text-center">
                <div style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--spacing-md)' }}>
                    {/* No Icon */}
                </div>
                <h3 style={{
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: 600,
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--color-text-primary)'
                }}>
                    No Images Yet
                </h3>
                <p style={{ color: 'var(--color-text-tertiary)' }}>
                    Generate your first image to see it here!
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="glass-card p-xl">
                <h2 style={{
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 700,
                    marginBottom: 'var(--spacing-lg)',
                    color: 'var(--color-text-primary)'
                }}>
                    Generated Images ({images.length})
                </h2>

                <div className="grid grid-3">
                    {images.map((image, index) => (
                        <div
                            key={image.filename || index}
                            className="glass-card animate-fade-in"
                            style={{
                                cursor: 'pointer',
                                overflow: 'hidden',
                                padding: 0,
                                animationDelay: `${index * 50}ms`
                            }}
                            onClick={() => setSelectedImage(image)}
                        >
                            <div style={{
                                position: 'relative',
                                paddingBottom: '100%',
                                background: 'var(--color-bg-tertiary)'
                            }}>
                                <img
                                    src={image.image_url}
                                    alt={image.prompt || 'Generated image'}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform var(--transition-base)'
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                />
                            </div>

                            {image.prompt && (
                                <div style={{ padding: 'var(--spacing-md)' }}>
                                    <p style={{
                                        fontSize: 'var(--font-size-sm)',
                                        color: 'var(--color-text-secondary)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {image.prompt}
                                    </p>
                                    {image.model && (
                                        <p style={{
                                            fontSize: 'var(--font-size-xs)',
                                            color: 'var(--color-text-muted)',
                                            marginTop: 'var(--spacing-xs)'
                                        }}>
                                            {image.model.split('/').pop()}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: 'var(--spacing-xl)',
                        cursor: 'pointer'
                    }}
                    onClick={() => setSelectedImage(null)}
                    className="animate-fade-in"
                >
                    <div
                        style={{
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            position: 'relative'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage.image_url}
                            alt={selectedImage.prompt}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-xl)'
                            }}
                        />

                        <div className="glass-card p-lg" style={{ marginTop: 'var(--spacing-md)' }}>
                            {selectedImage.prompt && (
                                <div className="mb-md">
                                    <label className="label">Prompt</label>
                                    <p style={{ color: 'var(--color-text-primary)' }}>
                                        {selectedImage.prompt}
                                    </p>
                                </div>
                            )}

                            {selectedImage.model && (
                                <div className="mb-md">
                                    <label className="label">Model</label>
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                        {selectedImage.model}
                                    </p>
                                </div>
                            )}

                            {selectedImage.config && (
                                <div className="mb-md">
                                    <label className="label">Configuration</label>
                                    <div className="flex gap-md" style={{ flexWrap: 'wrap' }}>
                                        {selectedImage.config.width && (
                                            <span className="badge badge-primary">
                                                {selectedImage.config.width}x{selectedImage.config.height}
                                            </span>
                                        )}
                                        {selectedImage.config.num_inference_steps && (
                                            <span className="badge badge-primary">
                                                {selectedImage.config.num_inference_steps} steps
                                            </span>
                                        )}
                                        {selectedImage.config.guidance_scale && (
                                            <span className="badge badge-primary">
                                                CFG: {selectedImage.config.guidance_scale}
                                            </span>
                                        )}
                                        {selectedImage.config.seed && (
                                            <span className="badge badge-primary">
                                                Seed: {selectedImage.config.seed}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-md">
                                <a
                                    href={selectedImage.image_url}
                                    download={selectedImage.filename}
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                >
                                    Download
                                </a>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedImage(null)}
                                    style={{ flex: 1 }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ImageGallery
