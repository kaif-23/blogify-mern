import { useState, useEffect } from 'react';
import api, { getImageUrl } from '../services/api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function EditBlogPage() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [currentCoverImage, setCurrentCoverImage] = useState('');
    const [newCoverImage, setNewCoverImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await api.get(`/blog/${id}`);
                const blog = res.data.blog;

                if (!user || user._id !== blog.createdBy._id) {
                    setError("You are not authorized to edit this post.");
                    setTimeout(() => navigate('/'), 3000);
                    return;
                }

                setTitle(blog.title);
                setBody(blog.body);
                setCurrentCoverImage(getImageUrl(blog.coverImageURL));
                setLoading(false);
            } catch (err) {
                setError("Failed to load blog data.");
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id, user, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewCoverImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !body) {
            setError('Title and body are required.');
            return;
        }

        setSaving(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', body);
        if (newCoverImage) {
            formData.append('coverImage', newCoverImage);
        }

        try {
            await api.post(`/blog/edit/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate(`/blog/${id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update blog.');
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="container mt-5">
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-3">Loading editor...</p>
            </div>
        </div>
    );

    if (error && !title) return (
        <div className="container mt-5">
            <div className="alert alert-danger border-0 shadow-sm rounded-4">{error}</div>
        </div>
    );

    return (
        <div className="min-vh-100" style={{ background: 'linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)' }}>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* Header */}
                        <div className="text-center mb-5">
                            <div className="mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-pencil-square text-primary" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                </svg>
                            </div>
                            <h1 className="display-5 fw-bold mb-2" style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                Edit Your Story
                            </h1>
                            <p className="lead text-muted">Update and refine your content</p>
                        </div>

                        {/* Form Card */}
                        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="card-body p-4 p-md-5">
                                {error && (
                                    <div className="alert alert-danger border-0 rounded-3 d-flex align-items-center mb-4" role="alert">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-exclamation-triangle-fill me-2" viewBox="0 0 16 16">
                                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                        </svg>
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    {/* Cover Image Section */}
                                    <div className="mb-4">
                                        <label className="form-label fw-bold d-flex align-items-center mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-image me-2 text-primary" viewBox="0 0 16 16">
                                                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                                <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
                                            </svg>
                                            Cover Image
                                        </label>

                                        <div className="mb-3">
                                            <div className="position-relative rounded-3 overflow-hidden shadow-sm">
                                                <img
                                                    src={imagePreview || currentCoverImage}
                                                    className="w-100"
                                                    alt="Cover"
                                                    style={{ maxHeight: '350px', objectFit: 'cover' }}
                                                />
                                                {imagePreview && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-3 rounded-circle"
                                                        onClick={() => {
                                                            setImagePreview(null);
                                                            setNewCoverImage(null);
                                                        }}
                                                        style={{ width: '36px', height: '36px' }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <label
                                            htmlFor="newCoverImage"
                                            className="btn btn-outline-primary rounded-pill px-4"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upload me-2" viewBox="0 0 16 16">
                                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
                                            </svg>
                                            {imagePreview ? 'Change Image' : 'Upload New Image'}
                                        </label>
                                        <input
                                            type="file"
                                            className="d-none"
                                            id="newCoverImage"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        <div className="form-text text-muted small mt-2">
                                            Leave unchanged to keep current image
                                        </div>
                                    </div>

                                    {/* Title Input */}
                                    <div className="mb-4">
                                        <label htmlFor="title" className="form-label fw-bold d-flex align-items-center mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-card-heading me-2 text-primary" viewBox="0 0 16 16">
                                                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                                                <path d="M3 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-1z" />
                                            </svg>
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg border-2 rounded-3 shadow-sm"
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            style={{ fontSize: '1.1rem' }}
                                        />
                                    </div>

                                    {/* Body Textarea */}
                                    <div className="mb-4">
                                        <label htmlFor="body" className="form-label fw-bold d-flex align-items-center mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-file-text me-2 text-primary" viewBox="0 0 16 16">
                                                <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H5z" />
                                                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z" />
                                            </svg>
                                            Content
                                        </label>
                                        <textarea
                                            name="body"
                                            className="form-control border-2 rounded-3 shadow-sm"
                                            id="body"
                                            rows="16"
                                            value={body}
                                            onChange={(e) => setBody(e.target.value)}
                                            required
                                            style={{ fontSize: '1rem', lineHeight: '1.8', resize: 'vertical' }}
                                        ></textarea>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="d-flex gap-3 pt-3">
                                        <button
                                            className="btn btn-primary btn-lg rounded-pill px-5 flex-grow-1 shadow-sm"
                                            type="submit"
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle me-2" viewBox="0 0 16 16">
                                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                                                    </svg>
                                                    Update Blog
                                                </>
                                            )}
                                        </button>
                                        <Link
                                            to={`/blog/${id}`}
                                            className="btn btn-outline-secondary btn-lg rounded-pill px-4"
                                        >
                                            Cancel
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditBlogPage;