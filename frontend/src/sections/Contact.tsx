import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [status, setStatus] = useState<null | 'sending' | 'success' | 'error'>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-600 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden shadow-2xl">
          {/* Background circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-bold text-white mb-6"
              >
                Let's Build Something Great Together
              </motion.h2>
              <p className="text-indigo-100 text-lg mb-10 leading-relaxed">
                Have a project in mind? We'd love to hear about it. Send us a message and our team will get back to you within 24 hours.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 text-white">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-indigo-200 text-sm">Email Us</p>
                    <p className="font-bold">hello@webkarigor.com</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl"
            >
              {status === 'success' ? (
                <div className="text-center py-10">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-8">Thank you for reaching out. We'll be in touch soon.</p>
                  <button 
                    onClick={() => setStatus(null)}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Your Message</label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all resize-none"
                        placeholder="Tell us about your project..."
                      ></textarea>
                    </div>
                  </div>
                  <button
                    disabled={status === 'sending'}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${status === 'sending' ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-200'}`}
                  >
                    <span>{status === 'sending' ? 'Sending...' : 'Send Message'}</span>
                    <Send className="w-5 h-5" />
                  </button>
                  {status === 'error' && (
                    <p className="text-red-500 text-sm text-center">Something went wrong. Please try again later.</p>
                  )}
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
