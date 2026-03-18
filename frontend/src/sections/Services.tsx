import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Cloud, ShieldCheck, UserCircle, ArrowUpRight } from 'lucide-react';

const services = [
  {
    icon: <ShoppingCart className="w-8 h-8" />,
    title: 'Ecommerce Website Development',
    description: 'Custom ecommerce stores using modern technologies with secure payment integration and scalable architecture.',
    color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  },
  {
    icon: <Cloud className="w-8 h-8" />,
    title: 'Website Hosting Setup',
    description: 'Seamless deployment using cloud platforms like Vercel, AWS, or high-performance VPS hosting solutions.',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: 'Website Maintenance',
    description: 'Expert bug fixing, security updates, regular backups, and continuous performance monitoring for peace of mind.',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    icon: <UserCircle className="w-8 h-8" />,
    title: 'Custom Portfolio Development',
    description: 'Stunning personal portfolio websites for developers, designers, and freelancers to showcase their unique brand.',
    color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  }
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-foreground mb-4"
          >
            Comprehensive Digital Services
          </motion.h2>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-muted-foreground max-w-2xl mx-auto"
          >
            We provide everything you need to launch and sustain a successful digital presence.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-2xl border border-border bg-card hover:border-indigo-600/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${service.color}`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-indigo-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {service.description}
              </p>
              <button className="flex items-center text-indigo-600 hover:text-indigo-400 font-semibold group-hover:translate-x-2 transition-transform">
                <span>Learn More</span>
                <ArrowUpRight className="ml-1 w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
