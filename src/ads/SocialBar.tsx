'use client';

import React, { useEffect } from 'react';

const SocialBar: React.FC = () => {
    useEffect(() => {
        // Dynamically add the external script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//conductorhimselfwhipped.com/3b/d5/d8/3bd5d8862c6f3cb8de0cfe3b76a8a00f.js';
        document.body.appendChild(script);

        // Cleanup (optional)
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return null; // This component doesn't render anything
};

export default SocialBar;
