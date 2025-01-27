'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';

const HomePage = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      
      <main className="pt-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl font-bold leading-tight bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                Plan Your Events Together
              </h1>
              <p className="text-xl text-gray-600">
                Collaborate with your team to create amazing events
              </p>
              {!user ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register" className="btn-primary">
                    Get Started
                  </Link>
                  <Link href="/login" className="btn-secondary">
                    Sign In
                  </Link>
                </div>
              ) : (
                <Link href="/events" className="btn-primary">
                  View Events
                </Link>
              )}
            </div>
            <div className="relative">
              <Image
                src="/hero-image.jpg"
                alt="Event Planning"
                width={600}
                height={400}
                priority
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Co-EventPlanner?</h2>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="feature-card">
                <div className="feature-icon">🤝</div>
                <h3 className="text-xl font-bold mb-4">Collaborative Planning</h3>
                <p>Work together with your team in real-time to organize events</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3 className="text-xl font-bold mb-4">Budget Management</h3>
                <p>Track expenses and manage your event budget efficiently</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">✅</div>
                <h3 className="text-xl font-bold mb-4">Task Assignment</h3>
                <p>Assign and track tasks to ensure everything gets done</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎫</div>
                <h3 className="text-xl font-bold mb-4">Ticket Management</h3>
                <p>Sell and manage tickets for your events seamlessly</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="bg-gradient-to-br from-primary to-primary-dark py-20 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Transforming Event Planning
                  </h2>
                  <p className="text-xl font-semibold text-blue-100">
                    Making collaboration seamless and efficient
                  </p>
                </div>
                <blockquote className="text-lg md:text-xl text-blue-50 italic">
                  "CoEventPlanner has revolutionized how we organize events. The collaborative features and intuitive interface make it a game-changer for event management."
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16">
                    <Image
                      src="/tiffany.jpg"
                      alt="Tiffany"
                      fill
                      className="rounded-full object-cover border-4 border-white/20"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-lg">Tiffany</div>
                    <div className="text-blue-100">Founder & CEO</div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 relative">
                <div className="aspect-square relative max-w-md mx-auto">
                  <Image
                    src="/plan.jpg"
                    alt="Event Planning Success"
                    fill
                    className="rounded-2xl object-cover shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3 className="text-xl font-bold mb-4">Create an Event</h3>
                <p>Set up your event with all the necessary details</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3 className="text-xl font-bold mb-4">Invite Team Members</h3>
                <p>Add organizers and participants to collaborate</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3 className="text-xl font-bold mb-4">Plan Together</h3>
                <p>Collaborate on tasks, budget, and arrangements</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
