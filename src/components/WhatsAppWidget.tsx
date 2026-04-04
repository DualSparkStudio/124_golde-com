'use client';

import { useState } from 'react';

export default function WhatsAppWidget() {
  const [isHovered, setIsHovered] = useState(false);
  
  // Replace with your actual WhatsApp business number (with country code, no + or spaces)
  const phoneNumber = '919876543210'; // Example: 919876543210 for India
  const message = encodeURIComponent('Hi! I am interested in your jewelry collection.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '60px',
        height: '60px',
        backgroundColor: '#25D366',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        zIndex: 1000,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
      }}
      aria-label="Chat on WhatsApp"
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 175.216 175.552"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z"
          fill="#25D366"
        />
        <path
          d="M87.184 156.809a87.416 87.416 0 0 1-44.426-12.122l-31.749 8.33 8.477-30.967a87.317 87.317 0 0 1-13.256-46.467c.017-48.266 39.3-87.537 87.58-87.537a87.05 87.05 0 0 1 61.88 25.655 87.05 87.05 0 0 1 25.617 61.932c-.018 48.267-39.3 87.537-87.579 87.537z"
          fill="url(#a)"
        />
        <path
          d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
          fill="#fff"
        />
        <defs>
          <linearGradient
            id="a"
            x1="87.184"
            y1="25.227"
            x2="87.184"
            y2="156.809"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#25D366" />
            <stop offset="1" stopColor="#128C7E" />
          </linearGradient>
        </defs>
      </svg>
    </a>
  );
}
