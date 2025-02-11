'use client';

import React, { useEffect } from 'react';

const GoogleAnalytics = () => {
    useEffect(() => {
        // Load the Google Tag script
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-P9ZXER4F1C';
        document.head.appendChild(script1);

        // Initialize Google Tag
        const script2 = document.createElement('script');
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-P9ZXER4F1C');
        `;
        document.head.appendChild(script2);

        // Cleanup scripts on unmount (optional)
        return () => {
            document.head.removeChild(script1);
            document.head.removeChild(script2);
        };
    }, []);

    return null; // No UI component needed
};

export default GoogleAnalytics;
