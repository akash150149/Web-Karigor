import React from 'react';
import './Services.css';

const services = [
    {
        title: 'Ecommerce Development',
        desc: 'Custom-built online stores optimized for conversion and scalability.',
        icon: '🛍️'
    },
    {
        title: 'UI/UX Design',
        desc: 'Stunning user interfaces designed to captivate and engage your audience.',
        icon: '🎨'
    },
    {
        title: 'Custom Web Apps',
        desc: 'Besproke web solutions tailored to your unique business requirements.',
        icon: '🚀'
    },
    {
        title: 'Maintenance',
        desc: 'Ongoing support and performance optimization for your digital products.',
        icon: '🛠️'
    }
];

const Services = () => {
    return (
        <section id="services" className="services container">
            <div className="section-header">
                <h2 className="section-title">Our <span className="gradient-text">Services</span></h2>
                <p className="section-subtitle">Comprehensive solutions for the modern digital era.</p>
            </div>
            <div className="services-grid">
                {services.map((service, index) => (
                    <div key={index} className="service-card glass">
                        <div className="service-icon">{service.icon}</div>
                        <h3 className="service-title">{service.title}</h3>
                        <p className="service-desc">{service.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Services;
