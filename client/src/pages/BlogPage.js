import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

function BlogPage() {
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newComment, setNewComment] = useState('');

    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/blog/${id}`);
                setBlog(res.data.blog);
                setComments(res.data.comments);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load blog.');
            }
            setLoading(false);
        };
        fetchBlogData();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment) return;
        try {
            const res = await api.post(`/blog/comment/${id}`, { content: newComment });
            setComments([...comments, res.data]); // Add new comment to state
            setNewComment(''); // Clear input
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to post comment.');
        }
    };

    const handleDeleteBlog = async () => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            try {
                await api.post(`/blog/delete/${id}`);
                navigate('/');
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to delete blog.');
            }
        }
    };

    if (loading) return <p className="text-center mt-5">Loading blog...</p>;
    if (error) return <p className="alert alert-danger text-center">{error}</p>;
    if (!blog) return <p>Blog not found.</p>;

    const isAuthor = user && user._id === blog.createdBy?._id;

    return (
        <div className="container mt-4 mb-5">
            <div className="card p-4 shadow-lg">
                <h1 className="card-title text-center mb-4 text-primary">{blog.title}</h1>
                <img
                    src={getImageUrl(blog.coverImageURL)}
                    className="img-fluid rounded mb-4 mx-auto"
                    alt={blog.title}
                    style={{ maxHeight: '450px', objectFit: 'cover' }}
                    onError={(e) => e.target.src = 'https://placehold.co/800x450/e0e0e0/555555?text=Blog+Cover'}
                />
                <div style={{ maxWidth: '900px', margin: 'auto' }}>
                    <p className="card-text">
                        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '1.1rem' }}>{blog.body}</pre>
                    </p>
                    <hr className="my-4" />
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center">
                            <img
                                src={getImageUrl(blog.createdBy?.profileImageURL)}
                                width="60px" height="60px"
                                className="rounded-circle me-3"
                                alt={blog.createdBy?.fullName}
                                onError={(e) => e.target.src = 'https://placehold.co/60x60/aabbcc/ffffff?text=U'}
                            />
                            <div>
                                <span className="fw-bold fs-5 text-dark">{blog.createdBy?.fullName}</span><br />
                                <span className="text-muted" style={{ fontSize: '0.9em' }}>
                                    Published on {new Date(blog.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        {isAuthor && (
                            <div className="d-flex gap-2">
                                <Link to={`/blog/edit/${blog._id}`} className="btn btn-outline-secondary btn-sm">
                                    Edit Post
                                </Link>
                                <button onClick={handleDeleteBlog} className="btn btn-outline-danger btn-sm">
                                    Delete Post
                                </button>
                            </div>
                        )}
                    </div>

                    <h3 className="mb-3 text-secondary">Comments ({comments.length})</h3>
                    {user ? (
                        <form onSubmit={handleCommentSubmit} className="mb-4">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control rounded-start"
                                    placeholder="Add your comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    required
                                />
                                <button className="btn btn-primary rounded-end" type="submit">Add Comment</button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-muted">Please <Link to="/user/signin">sign in</Link> to leave a comment.</p>
                    )}

                    <div className="comments-section mt-4">
                        {comments.length > 0 ? (
                            comments.map(comment => (
                                <div className="card mb-3 shadow-sm border-0" key={comment._id}>
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-2">
                                            <img
                                                src={getImageUrl(comment.createdBy?.profileImageURL)}
                                                width="40px" height="40px"
                                                className="rounded-circle me-3"
                                                alt={comment.createdBy?.fullName}
                                                onError={(e) => e.target.src = 'https://placehold.co/40x40/aabbcc/ffffff?text=U'}
                                            />
                                            <div>
                                                <span className="fw-bold text-dark">{comment.createdBy?.fullName}</span><br />
                                                <span className="text-muted" style={{ fontSize: '0.8em' }}>
                                                    {new Date(comment.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="card-text mb-0">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted text-center">No comments yet. Be the first!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogPage;