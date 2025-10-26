import { useState, useEffect } from 'react';
import api, { getImageUrl } from '../services/api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function EditBlogPage() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [currentCoverImage, setCurrentCoverImage] = useState('');
    const [newCoverImage, setNewCoverImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await api.get(`/blog/${id}`);
                const blog = res.data.blog;

                // Authorization check
                if (!user || user._id !== blog.createdBy._id) {
                    setError("You are not authorized to edit this post.");
                    setTimeout(() => navigate('/'), 3000); // Redirect home
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !body) {
            setError('Title and body are required.');
            return;
        }

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
            navigate(`/blog/${id}`); // Navigate to the updated blog post
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update blog.');
        }
    };

    if (loading) return <p>Loading editor...</p>;
    if (error) return <p className="alert alert-danger">{error}</p>;

    return (
        <div className="container mt-5 mb-5">
            <div className="card p-4 shadow-lg mx-auto" style={{ maxWidth: '700px' }}>
                <h2 className="card-title text-center mb-4 text-primary">Edit Blog Post</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Current Cover Image</label>
                        <img
                            src={currentCoverImage}
                            className="img-fluid rounded mb-3"
                            alt="Current Cover"
                            style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }}
                        />
                        <label htmlFor="newCoverImage" className="form-label fw-bold mt-3">
                            Upload New Cover Image (Optional)
                        </label>
                        <input
                            type="file"
                            className="form-control"
                            id="newCoverImage"
                            onChange={(e) => setNewCoverImage(e.target.files[0])}
                        />
                        <div className="form-text text-muted">Leave blank to keep current image.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label fw-bold">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="body" className="form-label fw-bold">Blog Content</label>
                        <textarea
                            name="body"
                            className="form-control"
                            id="body"
                            rows="15"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="d-grid gap-2 mt-4">
                        <button className="btn btn-primary btn-lg" type="submit">Update Blog</button>
                        <Link to={`/blog/${id}`} className="btn btn-secondary btn-lg">Cancel</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditBlogPage;