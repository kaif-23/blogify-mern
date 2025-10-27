import { useState, useEffect } from 'react';
import api, { getImageUrl } from '../services/api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input, Upload, message, Alert, Spin } from 'antd';
import { SaveOutlined, CloudUploadOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons';

const { TextArea } = Input;

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

    const handleImageChange = (file) => {
        setNewCoverImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        return false;
    };

    const handleSubmit = async () => {
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
            message.success('Blog updated successfully!');
            navigate(`/blog/${id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update blog.');
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: '#0f0f23' }}>
            <Spin size="large" />
        </div>
    );

    if (error && !title) return (
        <div className="min-vh-100" style={{ background: '#0f0f23' }}>
            <div className="container py-5">
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid #ef4444',
                        borderRadius: '12px'
                    }}
                />
            </div>
        </div>
    );

    return (
        <div className="min-vh-100" style={{ background: '#0f0f23' }}>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* Header */}
                        <div className="text-center mb-4">
                            <div className="mb-3">
                                <EditOutlined style={{ fontSize: '48px', color: '#6366f1' }} />
                            </div>
                            <h1 style={{
                                color: '#e0e0e0',
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                marginBottom: '8px'
                            }}>
                                Edit Your Story
                            </h1>
                            <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>
                                Update and refine your content
                            </p>
                        </div>

                        {/* Form Card */}
                        <Card
                            style={{
                                background: '#1a1a2e',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px'
                            }}
                            bodyStyle={{ padding: '32px' }}
                        >
                            {error && (
                                <Alert
                                    message={error}
                                    type="error"
                                    showIcon
                                    closable
                                    onClose={() => setError('')}
                                    style={{
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid #ef4444',
                                        borderRadius: '8px',
                                        marginBottom: '24px'
                                    }}
                                />
                            )}

                            {/* Cover Image Section */}
                            <div className="mb-4">
                                <label style={{
                                    color: '#e0e0e0',
                                    fontWeight: '600',
                                    marginBottom: '12px',
                                    display: 'block'
                                }}>
                                    Cover Image
                                </label>

                                <div style={{ position: 'relative', marginBottom: '16px' }}>
                                    <img
                                        src={imagePreview || currentCoverImage}
                                        alt="Cover"
                                        style={{
                                            width: '100%',
                                            maxHeight: '350px',
                                            objectFit: 'cover',
                                            borderRadius: '12px'
                                        }}
                                    />
                                    {imagePreview && (
                                        <Button
                                            danger
                                            icon={<CloseCircleOutlined />}
                                            onClick={() => {
                                                setImagePreview(null);
                                                setNewCoverImage(null);
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: '12px',
                                                right: '12px',
                                                background: '#ef4444',
                                                border: 'none',
                                                borderRadius: '50%'
                                            }}
                                        />
                                    )}
                                </div>

                                <Upload
                                    beforeUpload={handleImageChange}
                                    showUploadList={false}
                                    accept="image/*"
                                >
                                    <Button
                                        icon={<CloudUploadOutlined />}
                                        style={{
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            border: '1px solid #6366f1',
                                            color: '#6366f1',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        {imagePreview ? 'Change Image' : 'Upload New Image'}
                                    </Button>
                                </Upload>
                                <p style={{
                                    color: '#6b7280',
                                    fontSize: '0.875rem',
                                    marginTop: '8px',
                                    marginBottom: 0
                                }}>
                                    Leave unchanged to keep current image
                                </p>
                            </div>

                            {/* Title Input */}
                            <div className="mb-4">
                                <label style={{
                                    color: '#e0e0e0',
                                    fontWeight: '600',
                                    marginBottom: '12px',
                                    display: 'block'
                                }}>
                                    Title *
                                </label>
                                <Input
                                    size="large"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{
                                        background: '#0f0f23',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: '#e0e0e0',
                                        fontSize: '1.1rem'
                                    }}
                                />
                            </div>

                            {/* Body Textarea */}
                            <div className="mb-4">
                                <label style={{
                                    color: '#e0e0e0',
                                    fontWeight: '600',
                                    marginBottom: '12px',
                                    display: 'block'
                                }}>
                                    Content *
                                </label>
                                <TextArea
                                    rows={16}
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    style={{
                                        background: '#0f0f23',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: '#e0e0e0',
                                        fontSize: '1rem',
                                        lineHeight: '1.8',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex gap-3">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<SaveOutlined />}
                                    onClick={handleSubmit}
                                    loading={saving}
                                    style={{
                                        flex: 1,
                                        background: '#6366f1',
                                        border: 'none',
                                        borderRadius: '8px',
                                        height: '48px',
                                        fontSize: '16px',
                                        fontWeight: '600'
                                    }}
                                >
                                    Update Blog
                                </Button>
                                <Link to={`/blog/${id}`}>
                                    <Button
                                        size="large"
                                        disabled={saving}
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            height: '48px',
                                            color: '#9ca3af',
                                            fontSize: '16px'
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditBlogPage;