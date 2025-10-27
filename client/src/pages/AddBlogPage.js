import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input, Upload, message, Alert } from 'antd';
import { CloudUploadOutlined, SendOutlined, CloseCircleOutlined, FileImageOutlined } from '@ant-design/icons';

const { TextArea } = Input;

function AddBlogPage() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleImageChange = (file) => {
        setCoverImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        return false; // Prevent auto upload
    };

    const handleSubmit = async () => {
        if (!title || !body || !coverImage) {
            setError('All fields are required.');
            return;
        }

        setLoading(true);
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
            message.success('Blog published successfully!');
            navigate(`/blog/${res.data._id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create blog.');
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-vh-100" style={{ background: '#0f0f23' }}>
                <div className="container py-5">
                    <Card style={{
                        background: '#1a1a2e',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#ef4444" className="mb-3" viewBox="0 0 16 16">
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
                        </svg>
                        <h3 style={{ color: '#e0e0e0' }}>Authentication Required</h3>
                        <p style={{ color: '#9ca3af' }}>You must be logged in to create a post.</p>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100" style={{ background: '#0f0f23' }}>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* Header */}
                        <div className="text-center mb-4">
                            <div className="mb-3">
                                <FileImageOutlined style={{ fontSize: '48px', color: '#6366f1' }} />
                            </div>
                            <h1 style={{
                                color: '#e0e0e0',
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                marginBottom: '8px'
                            }}>
                                Create Your Story
                            </h1>
                            <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>
                                Share your ideas with the world
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

                            {/* Cover Image Upload */}
                            <div className="mb-4">
                                <label style={{
                                    color: '#e0e0e0',
                                    fontWeight: '600',
                                    marginBottom: '12px',
                                    display: 'block'
                                }}>
                                    Cover Image *
                                </label>

                                {imagePreview ? (
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{
                                                width: '100%',
                                                maxHeight: '350px',
                                                objectFit: 'cover',
                                                borderRadius: '12px'
                                            }}
                                        />
                                        <Button
                                            danger
                                            icon={<CloseCircleOutlined />}
                                            onClick={() => {
                                                setImagePreview(null);
                                                setCoverImage(null);
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
                                    </div>
                                ) : (
                                    <Upload.Dragger
                                        beforeUpload={handleImageChange}
                                        showUploadList={false}
                                        accept="image/*"
                                        style={{
                                            background: '#0f0f23',
                                            border: '2px dashed rgba(99, 102, 241, 0.3)',
                                            borderRadius: '12px'
                                        }}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <CloudUploadOutlined style={{ color: '#6366f1', fontSize: '48px' }} />
                                        </p>
                                        <p style={{ color: '#e0e0e0', fontSize: '1.1rem', marginBottom: '8px' }}>
                                            Click or drag image to upload
                                        </p>
                                        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </Upload.Dragger>
                                )}
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
                                    placeholder="Enter a captivating title..."
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
                                    placeholder="Tell your story... Be creative and engaging!"
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
                                <p style={{
                                    color: '#6b7280',
                                    fontSize: '0.875rem',
                                    marginTop: '8px',
                                    marginBottom: 0
                                }}>
                                    💡 Tip: Use clear paragraphs and engaging language to keep readers interested
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex gap-3">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<SendOutlined />}
                                    onClick={handleSubmit}
                                    loading={loading}
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
                                    Publish Blog
                                </Button>
                                <Button
                                    size="large"
                                    onClick={() => navigate('/')}
                                    disabled={loading}
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
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddBlogPage;