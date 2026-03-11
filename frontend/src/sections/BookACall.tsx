import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Sparkles } from 'lucide-react';

const BookACall = () => {
  return (
    <section id="book-call" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold">READY TO SCALE?</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6"
          >
            Schedule a Consultation
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            Choose a time that works for you and let's discuss how we can help your business thrive in the digital landscape.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
          >
            {/* Left side info */}
            <div className="p-10 lg:p-12 bg-indigo-600 text-white">
               <h3 className="text-2xl font-bold mb-6">Discovery Session</h3>
               <p className="text-indigo-100 mb-8">What we'll cover:</p>
               <ul className="space-y-4 mb-10">
                 {['Project Goals & Scope', 'Technical Strategy', 'Timeline Estimates', 'Budgeting & Pricing'].map((item, i) => (
                   <li key={i} className="flex items-center space-x-3">
                     <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">✓</span>
                     <span className="font-medium">{item}</span>
                   </li>
                 ))}
               </ul>
               <div className="flex items-center space-x-4">
                 <div className="p-3 bg-white/10 rounded-xl">
                   <Clock className="w-6 h-6" />
                 </div>
                 <p className="font-bold">30-45 Minute Call</p>
               </div>
            </div>

            {/* Right side form */}
            <div className="p-10 lg:p-12">
               <form className="space-y-6">
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                   <input type="text" placeholder="Your Name" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                   <input type="email" placeholder="your@email.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Date</label>
                     <div className="relative">
                        <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                        <input type="date" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                     </div>
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Time</label>
                     <div className="relative">
                        <Clock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                        <input type="time" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                     </div>
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Message (Optional)</label>
                   <textarea rows={3} placeholder="Tell us briefly about your project..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"></textarea>
                 </div>
                 <button type="button" className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-xl">
                   Confirm Booking
                 </button>
               </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BookACall;
