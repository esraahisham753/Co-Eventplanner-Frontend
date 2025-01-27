'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Plan Your Events Together</h1>
          <p>Collaborate with your team to create amazing events</p>
          {!user ? (
            <div className="cta-buttons">
              <Link href="/register" className="primary-button">
                Get Started
              </Link>
              <Link href="/login" className="secondary-button">
                Sign In
              </Link>
            </div>
          ) : (
            <Link href="/events" className="primary-button">
              View Events
            </Link>
          )}
        </div>
        <div className="hero-image">
          <Image
            src="/hero-image.png"
            alt="Event Planning"
            width={600}
            height={400}
            priority
          />
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose Co-EventPlanner?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Collaborative Planning</h3>
            <p>Work together with your team in real-time to organize events</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Budget Management</h3>
            <p>Track expenses and manage your event budget efficiently</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Task Assignment</h3>
            <p>Assign and track tasks to ensure everything gets done</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎫</div>
            <h3>Ticket Management</h3>
            <p>Sell and manage tickets for your events seamlessly</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Create an Event</h3>
            <p>Set up your event with all the necessary details</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Invite Team Members</h3>
            <p>Add organizers and participants to collaborate</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Plan Together</h3>
            <p>Collaborate on tasks, budget, and arrangements</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .hero-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          padding: 4rem 0;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .hero-content h1 {
          font-size: 3.5rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.2;
        }

        .hero-content p {
          font-size: 1.25rem;
          color: #666;
          margin-bottom: 1rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
        }

        .primary-button {
          background: #2196f3;
          color: white;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.2s;
        }

        .primary-button:hover {
          background: #1976d2;
        }

        .secondary-button {
          background: white;
          color: #2196f3;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          border: 2px solid #2196f3;
          transition: all 0.2s;
        }

        .secondary-button:hover {
          background: #e3f2fd;
        }

        .features-section {
          padding: 4rem 0;
        }

        .features-section h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #1a1a1a;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .feature-card p {
          color: #666;
        }

        .how-it-works {
          padding: 4rem 0;
        }

        .how-it-works h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #1a1a1a;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .step-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
          position: relative;
        }

        .step-number {
          width: 40px;
          height: 40px;
          background: #2196f3;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.25rem;
          margin: 0 auto 1rem;
        }

        .step-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .step-card p {
          color: #666;
        }

        @media (max-width: 768px) {
          .hero-section {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
          }

          .hero-content h1 {
            font-size: 2.5rem;
          }

          .cta-buttons {
            justify-content: center;
          }

          .hero-image {
            order: -1;
          }

          .features-grid,
          .steps-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .home-container {
            padding: 1rem;
          }

          .hero-content h1 {
            font-size: 2rem;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
