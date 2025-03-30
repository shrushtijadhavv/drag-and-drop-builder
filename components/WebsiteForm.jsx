// src/components/WebsiteForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WebsiteForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'ecommerce',
    primaryColor: '#4a90e2',
    secondaryColor: '#ffffff',
    logo: null,
    description: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
    },
    features: {
      gallery: false,
      contactForm: false,
      testimonials: false,
      blog: false,
      ecommerce: false,
    },
  });

  const [logoPreview, setLogoPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFeatureToggle = (feature) => {
    setFormData({
      ...formData,
      features: {
        ...formData.features,
        [feature]: !formData.features[feature],
      },
    });
  };

  const handleSocialChange = (platform, value) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [platform]: value,
      },
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        logo: file,
      });
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to generate website
    setTimeout(() => {
      // Store form data in localStorage to pass to the builder
      localStorage.setItem('websiteData', JSON.stringify(formData));
      
      // Redirect to the builder page
      navigate('/builder');
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="website-form-container">
      <div className="website-form-header">
        <h1>Create Your Website</h1>
        <p>Fill in the details below to get started with your new website</p>
      </div>
      
      <form className="website-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Business Information</h2>
          
          <div className="form-group">
            <label htmlFor="businessName">Business Name *</label>
            <input 
              type="text" 
              id="businessName" 
              name="businessName" 
              value={formData.businessName} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="businessType">Website Type</label>
            <select 
              id="businessType" 
              name="businessType" 
              value={formData.businessType} 
              onChange={handleInputChange}
            >
              <option value="ecommerce">E-Commerce</option>
              <option value="portfolio">Portfolio</option>
              <option value="blog">Blog</option>
              <option value="business">Business</option>
              <option value="personal">Personal</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Business Description</label>
            <textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              rows="4"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Appearance</h2>
          
          <div className="form-group color-picker">
            <label htmlFor="primaryColor">Primary Color</label>
            <input 
              type="color" 
              id="primaryColor" 
              name="primaryColor" 
              value={formData.primaryColor} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group color-picker">
            <label htmlFor="secondaryColor">Secondary Color</label>
            <input 
              type="color" 
              id="secondaryColor" 
              name="secondaryColor" 
              value={formData.secondaryColor} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="logo">Upload Logo</label>
            <input 
              type="file" 
              id="logo" 
              name="logo" 
              accept="image/*" 
              onChange={handleLogoChange} 
            />
            {logoPreview && (
              <div className="logo-preview">
                <img src={logoPreview} alt="Logo preview" />
              </div>
            )}
          </div>
        </div>
        
        <div className="form-section">
          <h2>Contact Information</h2>
          
          <div className="form-group">
            <label htmlFor="contactEmail">Email Address</label>
            <input 
              type="email" 
              id="contactEmail" 
              name="contactEmail" 
              value={formData.contactEmail} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="contactPhone">Phone Number</label>
            <input 
              type="tel" 
              id="contactPhone" 
              name="contactPhone" 
              value={formData.contactPhone} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea 
              id="address" 
              name="address" 
              value={formData.address} 
              onChange={handleInputChange} 
              rows="3"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Social Media</h2>
          
          <div className="form-group">
            <label htmlFor="facebook">Facebook URL</label>
            <input 
              type="url" 
              id="facebook" 
              value={formData.socialLinks.facebook} 
              onChange={(e) => handleSocialChange('facebook', e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="instagram">Instagram URL</label>
            <input 
              type="url" 
              id="instagram" 
              value={formData.socialLinks.instagram} 
              onChange={(e) => handleSocialChange('instagram', e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="twitter">Twitter URL</label>
            <input 
              type="url" 
              id="twitter" 
              value={formData.socialLinks.twitter} 
              onChange={(e) => handleSocialChange('twitter', e.target.value)} 
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Features</h2>
          
          <div className="features-grid">
            <div className="feature-toggle">
              <input 
                type="checkbox" 
                id="gallery" 
                checked={formData.features.gallery} 
                onChange={() => handleFeatureToggle('gallery')} 
              />
              <label htmlFor="gallery">Image Gallery</label>
            </div>
            
            <div className="feature-toggle">
              <input 
                type="checkbox" 
                id="contactForm" 
                checked={formData.features.contactForm} 
                onChange={() => handleFeatureToggle('contactForm')} 
              />
              <label htmlFor="contactForm">Contact Form</label>
            </div>
            
            <div className="feature-toggle">
              <input 
                type="checkbox" 
                id="testimonials" 
                checked={formData.features.testimonials} 
                onChange={() => handleFeatureToggle('testimonials')} 
              />
              <label htmlFor="testimonials">Testimonials</label>
            </div>
            
            <div className="feature-toggle">
              <input 
                type="checkbox" 
                id="blog" 
                checked={formData.features.blog} 
                onChange={() => handleFeatureToggle('blog')} 
              />
              <label htmlFor="blog">Blog Section</label>
            </div>
            
            <div className="feature-toggle">
              <input 
                type="checkbox" 
                id="ecommerce" 
                checked={formData.features.ecommerce} 
                onChange={() => handleFeatureToggle('ecommerce')} 
              />
              <label htmlFor="ecommerce">E-Commerce</label>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Website...' : 'Create My Website'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WebsiteForm;