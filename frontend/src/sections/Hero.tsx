import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Rocket } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold uppercase tracking-wider">Software Development Excellence</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl lg:text-7xl font-extrabold text-foreground leading-tight mb-6"
        >
          Building <span className="text-indigo-600">Scalable</span> Digital Products <br className="hidden lg:block" /> for Your Business
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          We specialize in crafting high-performance ecommerce platforms, custom portfolio websites, 
          and provide top-notch hosting and maintenance services to help your business grow online.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <a
            href="#projects"
            className="group px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold flex items-center space-x-2 hover:bg-primary/90 transition-all shadow-xl hover:shadow-2xl"
          >
            <span>View Our Work</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#book-call"
            className="px-8 py-4 bg-background text-foreground border-2 border-border rounded-xl font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-lg"
          >
            Book a Call
          </a>
        </motion.div>

        {/* Floating tech stack or image placeholder */}
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.8 }}
           className="mt-20 relative px-4"
        >
          <div className="bg-gradient-to-b from-indigo-500/10 to-transparent rounded-3xl p-2 shadow-2xl overflow-hidden border border-border">
            <div className="bg-card rounded-2xl h-64 lg:h-96 flex items-center justify-center text-muted-foreground">
              {/* This is where a mockup image would go */}
              <div className="text-center">
                 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    <Rocket className="w-8 h-8" />
                 </div>
                 <p className="font-medium text-foreground">Premium Digital Solutions</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
