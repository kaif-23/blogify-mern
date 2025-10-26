import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AddBlogPage() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !body || !coverImage) {
            setError('All fields are required.');
            return;
        }

        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', body);
        formData.append('coverImage', coverImage);

        try {
            const res = await api.post('/blog', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate(`/blog/${res.data._id}`); // Navigate to the new blog post
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create blog.');
        }
    };

    if (!user) {
        return <p>You must be logged in to create a post.</p>;
    }

    return (
        <div className="container mt-5 mb-5">
            <div className="card p-4 shadow-lg mx-auto" style={{ maxWidth: '700px' }}>
                <h2 className="card-title text-center mb-4 text-primary">Create a New Blog Post</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="coverImage" className="form-label fw-bold">Cover Image</label>
                        <input
                            type="file"
                            className="form-control"
                            id="coverImage"
                            onChange={(e) => setCoverImage(e.target.files[0])}
                            required
                        />
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
                            placeholder="Enter blog title"
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
                            placeholder="Start writing your amazing blog content here..."
                        ></textarea>
                    </div>
                    <div className="d-grid gap-2 mt-4">
                        <button className="btn btn-primary btn-lg" type="submit">Publish Blog</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddBlogPage;