import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: 'HaatBaazar',
    description: 'A full-featured online store with real-time inventory and stripe integration.',
    // tech: ['React', 'Node.js', 'PostgreSQL', 'Tailwind'],
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1000',
    live: 'https://haat-baazar.onrender.com',
    github: 'https://github.com/akash150149/HaatBaazar'
  },
  {
    title: 'Cafe',
    description: 'An interactive showcase for a leading design studio with fluid animations.',
    // tech: ['Next.js', 'Framer Motion', 'TypeScript'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
    live: '#',
    github: '#'
  },
  {
    title: 'SaaS Analytics Dashboard',
    description: 'Enterprise-grade monitoring dashboard with live data visualization charts.',
    tech: ['React', 'D3.js', 'Firebase', 'Mantine'],
    image: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=1000',
    live: '#',
    github: '#'
  }
];

const Projects = () => {
  return (
    <section id="projects" className="py-24 bg-muted/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-foreground mb-4"
            >
              Our Featured Projects
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              Explore our latest work, showcasing our expertise in building high-quality digital solutions across various industries.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <button className="px-6 py-3 bg-card border border-border text-foreground rounded-xl font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all">
              See All Work
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="flex space-x-4">
                    <a href={project.live} className="p-3 bg-background rounded-full text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <a href={project.github} className="p-3 bg-background rounded-full text-foreground hover:bg-foreground hover:text-background transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-8">
                {/* <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((t, i) => (
                    <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                      {t}
                    </span>
                  ))}
                </div> */}
                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-indigo-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
