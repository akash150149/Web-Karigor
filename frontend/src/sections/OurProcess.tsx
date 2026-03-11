import React from 'react';
import { motion } from 'motion/react';
import { PhoneCall, ClipboardList, Code2, Rocket, HeartHandshake } from 'lucide-react';

const steps = [
  {
    icon: <PhoneCall className="w-6 h-6" />,
    title: 'Discovery Call',
    description: 'We discuss your project goals, target audience, and specific requirements to build a solid foundation.',
    color: 'bg-indigo-600',
  },
  {
    icon: <ClipboardList className="w-6 h-6" />,
    title: 'Planning and Design',
    description: 'We create wireframes, UI/UX designs, and a detailed technical roadmap tailored to your needs.',
    color: 'bg-purple-600',
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: 'Development',
    description: 'Our expert developers bring designs to life using clean, scalable code and the latest technologies.',
    color: 'bg-pink-600',
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: 'Deployment',
    description: 'We handle the complete setup of your production environment and launch your product safely.',
    color: 'bg-blue-600',
  },
  {
    icon: <HeartHandshake className="w-6 h-6" />,
    title: 'Maintenance Support',
    description: 'We provide ongoing technical support, security updates, and performance optimizations post-launch.',
    color: 'bg-emerald-600',
  }
];

const OurProcess = () => {
  return (
    <section id="process" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            How We Work
          </motion.h2>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-gray-600 max-w-2xl mx-auto"
          >
            A streamlined process from initial concept to long-term success.
          </motion.p>
        </div>

        <div className="relative">
          {/* Vertical line for desktop */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-100 hidden lg:block"></div>

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col lg:flex-row items-center ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1 w-full lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={`p-8 rounded-3xl bg-gray-50 border border-gray-100 relative ${index % 2 === 0 ? 'lg:ml-12' : 'lg:mr-12'}`}
                  >
                    <div className={`w-12 h-12 ${step.color} text-white rounded-2xl flex items-center justify-center mb-6 lg:hidden`}>
                      {step.icon}
                    </div>
                    <span className="text-sm font-bold text-indigo-600 mb-2 block">Step {index + 1}</span>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </motion.div>
                </div>

                {/* Central Circle */}
                <div className="relative flex items-center justify-center w-12 h-12 hidden lg:flex">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className={`w-12 h-12 ${step.color} text-white rounded-full flex items-center justify-center z-10 shadow-lg`}
                  >
                    {step.icon}
                  </motion.div>
                </div>

                <div className="flex-1 hidden lg:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurProcess;
