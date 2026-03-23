import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PhoneCall } from 'lucide-react';

/**
 * FloatingBookButton — Fixed bottom-right FAB.
 * Appears after scrolling 300px. Scrolls to #book-call on click.
 */
const FloatingBookButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToBooking = () => {
    const el = document.getElementById('book-call');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          id="fab-book-call"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={scrollToBooking}
          aria-label="Book a Call"
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-0 overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-all duration-300 cursor-pointer"
          style={{ height: '52px', minWidth: '52px' }}
        >
          {/* Icon always visible */}
          <span className="flex items-center justify-center w-[52px] h-[52px] shrink-0">
            <PhoneCall className="w-5 h-5" />
          </span>
          {/* Label expands on hover */}
          <span className="max-w-0 group-hover:max-w-[140px] overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out pr-0 group-hover:pr-4 text-sm font-bold">
            Book a Call
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingBookButton;
