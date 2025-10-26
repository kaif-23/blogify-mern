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
        if (!newComment.trim()) return;
        try {
            const res = await api.post(`/blog/comment/${id}`, { content: newComment });
            setComments([...comments, res.data]);
            setNewComment('');
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

    if (loading) return (
        <div className="container mt-5">
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-3">Loading article...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="container mt-5">
            <div className="alert alert-danger border-0 shadow-sm rounded-4">{error}</div>
        </div>
    );

    if (!blog) return (
        <div className="container mt-5">
            <div className="alert alert-warning border-0 shadow-sm rounded-4">Blog not found.</div>
        </div>
    );

    const isAuthor = user && user._id === blog.createdBy?._id;

    return (
        <div className="min-vh-100" style={{ background: 'linear-gradient(to bottom, #f8f9fa 0%, #ffffff 50%)' }}>
            <div className="container py-4">
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Article</li>
                    </ol>
                </nav>

                {/* Main Article */}
                <article className="mx-auto" style={{ maxWidth: '900px' }}>
                    {/* Title Section */}
                    <div className="text-center mb-4">
                        <h1 className="display-5 fw-bold mb-4 lh-base" style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            {blog.title}
                        </h1>

                        {/* Author Card */}
                        <div className="d-flex align-items-center justify-content-center mb-4">
                            <img
                                src={getImageUrl(blog.createdBy?.profileImageURL)}
                                width="56"
                                height="56"
                                className="rounded-circle me-3 border border-3 border-white shadow"
                                alt={blog.createdBy?.fullName}
                                onError={(e) => e.target.src = 'https://placehold.co/56x56/667eea/ffffff?text=A'}
                                style={{ objectFit: 'cover' }}
                            />
                            <div className="text-start">
                                <div className="fw-bold fs-6 text-dark">{blog.createdBy?.fullName}</div>
                                <div className="text-muted small">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-calendar3 me-1" viewBox="0 0 16 16">
                                        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
                                        <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                                    </svg>
                                    {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="position-relative mb-5 rounded-4 overflow-hidden shadow-lg">
                        <img
                            src={getImageUrl(blog.coverImageURL)}
                            className="w-100"
                            alt={blog.title}
                            style={{ maxHeight: '500px', objectFit: 'cover' }}
                            onError={(e) => e.target.src = 'https://placehold.co/1200x600/667eea/ffffff?text=Blog+Cover'}
                        />
                    </div>

                    {/* Content Card */}
                    <div className="card border-0 shadow-sm mb-5 rounded-4">
                        <div className="card-body p-4 p-md-5">
                            {/* Action Buttons */}
                            {isAuthor && (
                                <div className="d-flex gap-2 mb-4 pb-4 border-bottom">
                                    <Link to={`/blog/edit/${blog._id}`} className="btn btn-outline-primary rounded-pill px-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil me-2" viewBox="0 0 16 16">
                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                        </svg>
                                        Edit Post
                                    </Link>
                                    <button onClick={handleDeleteBlog} className="btn btn-outline-danger rounded-pill px-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash me-2" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                        </svg>
                                        Delete Post
                                    </button>
                                </div>
                            )}

                            {/* Article Content */}
                            <div className="article-content" style={{
                                fontSize: '1.125rem',
                                lineHeight: '1.8',
                                color: '#374151'
                            }}>
                                <pre style={{
                                    whiteSpace: 'pre-wrap',
                                    fontFamily: 'inherit',
                                    margin: 0,
                                    border: 'none',
                                    padding: 0,
                                    background: 'transparent'
                                }}>
                                    {blog.body}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4 p-md-5">
                            <h3 className="mb-4 d-flex align-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-chat-dots me-2 text-primary" viewBox="0 0 16 16">
                                    <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                                    <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z" />
                                </svg>
                                Comments ({comments.length})
                            </h3>

                            {/* Comment Form */}
                            {user ? (
                                <form onSubmit={handleCommentSubmit} className="mb-5">
                                    <div className="d-flex gap-3 align-items-start">
                                        <img
                                            src={getImageUrl(user.profileImageURL)}
                                            width="48"
                                            height="48"
                                            className="rounded-circle border border-2 border-light shadow-sm"
                                            alt={user.fullName}
                                            onError={(e) => e.target.src = 'https://placehold.co/48x48/667eea/ffffff?text=U'}
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <div className="flex-grow-1">
                                            <textarea
                                                className="form-control border-2 rounded-3 shadow-sm"
                                                placeholder="Share your thoughts..."
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                required
                                                rows="3"
                                                style={{ resize: 'none' }}
                                            />
                                            <div className="d-flex justify-content-end mt-2">
                                                <button className="btn btn-primary rounded-pill px-4" type="submit">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send me-2" viewBox="0 0 16 16">
                                                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                                                    </svg>
                                                    Post Comment
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div className="alert alert-light border rounded-3 mb-4">
                                    <p className="mb-0 text-muted">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle me-2" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                        </svg>
                                        Please <Link to="/user/signin" className="fw-bold text-decoration-none">sign in</Link> to leave a comment.
                                    </p>
                                </div>
                            )}

                            {/* Comments List */}
                            <div className="comments-list">
                                {comments.length > 0 ? (
                                    comments.map((comment, index) => (
                                        <div
                                            key={comment._id}
                                            className={`d-flex gap-3 ${index !== comments.length - 1 ? 'pb-4 mb-4 border-bottom' : ''}`}
                                        >
                                            <img
                                                src={getImageUrl(comment.createdBy?.profileImageURL)}
                                                width="44"
                                                height="44"
                                                className="rounded-circle border border-2 border-light shadow-sm"
                                                alt={comment.createdBy?.fullName}
                                                onError={(e) => e.target.src = 'https://placehold.co/44x44/667eea/ffffff?text=U'}
                                                style={{ objectFit: 'cover' }}
                                            />
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center mb-2">
                                                    <span className="fw-bold text-dark me-2">
                                                        {comment.createdBy?.fullName}
                                                    </span>
                                                    <span className="text-muted small">
                                                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="mb-0 text-dark" style={{ lineHeight: '1.6' }}>
                                                    {comment.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-chat-square-dots text-muted opacity-50 mb-3" viewBox="0 0 16 16">
                                            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                            <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                        </svg>
                                        <p className="text-muted mb-0">No comments yet. Be the first to share your thoughts!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}

export default BlogPage;