import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card, Avatar, Button, Input, Spin, Breadcrumb, Tag, Divider } from 'antd';
import { HomeOutlined, EditOutlined, DeleteOutlined, SendOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

const { TextArea } = Input;

function BlogPage() {
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

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

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;
        try {
            setSubmitting(true);
            const res = await api.post(`/blog/comment/${id}`, { content: newComment });
            setComments([...comments, res.data]);
            setNewComment('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to post comment.');
        } finally {
            setSubmitting(false);
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
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: '#0f0f23' }}>
            <Spin size="large" />
        </div>
    );

    if (error && !blog) return (
        <div className="min-vh-100" style={{ background: '#0f0f23' }}>
            <div className="container py-5">
                <Card style={{
                    background: '#1a1a2e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#ef4444'
                }}>
                    {error}
                </Card>
            </div>
        </div>
    );

    if (!blog) return null;

    const isAuthor = user && user._id === blog.createdBy?._id;

    return (
        <div className="min-vh-100" style={{ background: '#0f0f23' }}>
            <div className="container py-4">
                {/* Breadcrumb */}
                <Breadcrumb
                    className="mb-4"
                    items={[
                        {
                            href: '/',
                            title: <><HomeOutlined /> <span>Home</span></>,
                        },
                        {
                            title: 'Article',
                        },
                    ]}
                    style={{ color: '#9ca3af' }}
                />

                {/* Main Article Card */}
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <Card
                            style={{
                                background: '#1a1a2e',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                marginBottom: '24px'
                            }}
                            bodyStyle={{ padding: '32px' }}
                        >
                            {/* Title */}
                            <h1 style={{
                                color: '#e0e0e0',
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                marginBottom: '24px',
                                lineHeight: '1.3'
                            }}>
                                {blog.title}
                            </h1>

                            {/* Author Info */}
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <div className="d-flex align-items-center">
                                    <Avatar
                                        size={56}
                                        src={getImageUrl(blog.createdBy?.profileImageURL)}
                                        style={{ border: '2px solid #6366f1', marginRight: '16px' }}
                                    >
                                        {blog.createdBy?.fullName?.[0] || 'A'}
                                    </Avatar>
                                    <div>
                                        <div style={{ color: '#e0e0e0', fontWeight: '600', fontSize: '1rem' }}>
                                            {blog.createdBy?.fullName}
                                        </div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                                            <ClockCircleOutlined style={{ marginRight: '6px' }} />
                                            {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {isAuthor && (
                                    <div className="d-flex gap-2">
                                        <Link to={`/blog/edit/${blog._id}`}>
                                            <Button
                                                icon={<EditOutlined />}
                                                style={{
                                                    background: 'rgba(99, 102, 241, 0.1)',
                                                    border: '1px solid #6366f1',
                                                    color: '#6366f1',
                                                    borderRadius: '8px'
                                                }}
                                            >
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={handleDeleteBlog}
                                            style={{
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                border: '1px solid #ef4444',
                                                borderRadius: '8px'
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Cover Image */}
                            <div style={{
                                borderRadius: '12px',
                                overflow: 'hidden',
                                marginBottom: '32px'
                            }}>
                                <img
                                    src={getImageUrl(blog.coverImageURL)}
                                    alt={blog.title}
                                    style={{
                                        width: '100%',
                                        maxHeight: '500px',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => e.target.src = 'https://placehold.co/1200x600/1a1a2e/6366f1?text=Blog+Cover'}
                                />
                            </div>

                            {/* Content */}
                            <div style={{
                                color: '#d1d5db',
                                fontSize: '1.125rem',
                                lineHeight: '1.8',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {blog.body}
                            </div>
                        </Card>

                        {/* Comments Section */}
                        <Card
                            title={
                                <span style={{ color: '#e0e0e0', fontSize: '1.5rem', fontWeight: '600' }}>
                                    💬 Comments ({comments.length})
                                </span>
                            }
                            style={{
                                background: '#1a1a2e',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px'
                            }}
                            headStyle={{
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                padding: '20px 24px'
                            }}
                            bodyStyle={{ padding: '24px' }}
                        >
                            {/* Comment Form */}
                            {user ? (
                                <div className="mb-4">
                                    <div className="d-flex gap-3 mb-3">
                                        <Avatar
                                            size={44}
                                            src={getImageUrl(user.profileImageURL)}
                                            style={{ border: '2px solid #6366f1' }}
                                        >
                                            {user.fullName?.[0] || 'U'}
                                        </Avatar>
                                        <div style={{ flex: 1 }}>
                                            <TextArea
                                                rows={3}
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Share your thoughts..."
                                                style={{
                                                    background: '#0f0f23',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '8px',
                                                    color: '#e0e0e0',
                                                    resize: 'none'
                                                }}
                                            />
                                            <div className="d-flex justify-content-end mt-2">
                                                <Button
                                                    type="primary"
                                                    icon={<SendOutlined />}
                                                    onClick={handleCommentSubmit}
                                                    loading={submitting}
                                                    style={{
                                                        background: '#6366f1',
                                                        border: 'none',
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    Post Comment
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Card
                                    style={{
                                        background: 'rgba(99, 102, 241, 0.05)',
                                        border: '1px solid rgba(99, 102, 241, 0.2)',
                                        borderRadius: '8px',
                                        marginBottom: '24px'
                                    }}
                                    bodyStyle={{ padding: '16px' }}
                                >
                                    <p style={{ color: '#9ca3af', marginBottom: 0 }}>
                                        <UserOutlined style={{ marginRight: '8px' }} />
                                        Please <Link to="/user/signin" style={{ color: '#6366f1', fontWeight: '600' }}>sign in</Link> to leave a comment.
                                    </p>
                                </Card>
                            )}

                            {/* Comments List */}
                            {comments.length > 0 ? (
                                <div>
                                    {comments.map((comment, index) => (
                                        <div key={comment._id}>
                                            <div className="d-flex gap-3">
                                                <Avatar
                                                    size={40}
                                                    src={getImageUrl(comment.createdBy?.profileImageURL)}
                                                    style={{ border: '2px solid rgba(99, 102, 241, 0.3)' }}
                                                >
                                                    {comment.createdBy?.fullName?.[0] || 'A'}
                                                </Avatar>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{
                                                        background: '#0f0f23',
                                                        padding: '12px 16px',
                                                        borderRadius: '12px',
                                                        border: '1px solid rgba(255,255,255,0.05)'
                                                    }}>
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <span style={{
                                                                color: '#e0e0e0',
                                                                fontWeight: '600',
                                                                fontSize: '0.95rem'
                                                            }}>
                                                                {comment.createdBy?.fullName}
                                                            </span>
                                                            <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                                                                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </span>
                                                        </div>
                                                        <p style={{
                                                            color: '#d1d5db',
                                                            marginBottom: 0,
                                                            lineHeight: '1.6',
                                                            fontSize: '0.95rem'
                                                        }}>
                                                            {comment.content}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            {index < comments.length - 1 && (
                                                <Divider style={{
                                                    borderColor: 'rgba(255,255,255,0.05)',
                                                    margin: '20px 0'
                                                }} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '48px 0',
                                    color: '#6b7280'
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-chat-square-dots mb-3 opacity-50" viewBox="0 0 16 16">
                                        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                        <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                    </svg>
                                    <p style={{ marginBottom: 0 }}>No comments yet. Be the first to share your thoughts!</p>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogPage;