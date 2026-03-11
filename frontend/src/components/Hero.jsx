import React from 'react';
import './Hero.css';

const Hero = () => {
    return (
        <section id="home" className="hero container fade-in">
            <div className="hero-content">
                <h1 className="hero-title">
                    Build Your <span className="gradient-text">Ecommerce Empire</span> With Experts.
                </h1>
                <p className="hero-subtitle">
                    We specialize in crafting high-conversion ecommerce websites and custom digital solutions that scale your business to new heights.
                </p>
                <div className="hero-btns">
                    <button className="btn-primary">Get Started</button>
                    <button className="btn-outline">View Portfolio</button>
                </div>
            </div>
            <div className="hero-visual">
                <div className="blob"></div>
            </div>
        </section>
    );
};

export default Hero;
