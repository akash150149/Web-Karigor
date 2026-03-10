import React from 'react';
import './BookingModal.css';

const BookingModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically handle form submission
        alert('Thank you! We will get back to you soon.');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h2 className="modal-title">Book a <span className="gradient-text">Strategy Call</span></h2>
                <p className="modal-subtitle">Let's discuss how we can scale your business together.</p>

                <form className="booking-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="John Doe" required />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="john@example.com" required />
                    </div>
                    <div className="form-group">
                        <label>Service Interest</label>
                        <select required>
                            <option value="">Select a service</option>
                            <option value="ecommerce">Ecommerce Development</option>
                            <option value="uiux">UI/UX Design</option>
                            <option value="webapps">Custom Web Apps</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea rows="4" placeholder="Tell us about your project..." required></textarea>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
