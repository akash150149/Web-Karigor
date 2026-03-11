import React from 'react';
import { motion } from 'motion/react';
import { Users, Target, Zap, CheckCircle2 } from 'lucide-react';

const AboutUs = () => {
  return (
    <section id="about" className="py-24 bg-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8">Engineering Excellence with a Human Touch</h2>
            <p className="text-gray-400 text-xl mb-8 leading-relaxed">
              We are a dedicated team of developers, designers, and strategists passionate about building high-performance 
              digital products that drive business growth. Our mission is to simplify complex technology for our clients.
            </p>

            <div className="space-y-6">
              {[
                { title: 'Our Mission', icon: <Target className="w-6 h-6 text-indigo-400" />, text: 'To empower businesses through scalable and innovative technology solutions.' },
                { title: 'Development Philosophy', icon: <Zap className="w-6 h-6 text-purple-400" />, text: 'Clean code, user-centric design, and performance-first development.' },
                { title: 'Our Team', icon: <Users className="w-6 h-6 text-pink-400" />, text: 'A collaborative group of experts committed to delivering exceptional results.' }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="mt-1 p-2 bg-white/5 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                    <p className="text-gray-500">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-12 relative z-10">
              <h3 className="text-2xl font-bold mb-6">Technologies We Master</h3>
              <div className="grid grid-cols-2 gap-4">
                {['React / Vite', 'Node.js / Express', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'AWS / Cloud'].map((tech, i) => (
                  <div key={i} className="flex items-center space-x-2 text-indigo-100 bg-white/10 p-3 rounded-xl border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-indigo-300" />
                    <span className="font-medium text-sm">{tech}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 pt-12 border-t border-white/20">
                <div className="flex -space-x-4 mb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-indigo-600 bg-gray-800 flex items-center justify-center overflow-hidden">
                       <Users className="w-6 h-6 text-gray-400" />
                    </div>
                  ))}
                </div>
                <p className="font-bold text-indigo-200">Trusted by 20+ Businesses Worldwide</p>
              </div>
            </div>
            
            {/* Decorative background element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/20 rounded-full blur-[120px] -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
