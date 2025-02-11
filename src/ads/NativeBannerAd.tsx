'use client';

import React, { useEffect } from 'react';

const NativeBannerAd: React.FC = () => {
    useEffect(() => {
        // Dynamically add the external script
        const script = document.createElement('script');
        script.async = true;
        script.dataset.cfasync = "false";
        script.src = "//conductorhimselfwhipped.com/d21b7aff076d39284ab3b2f65630c5cc/invoke.js";
        document.body.appendChild(script);

        // Cleanup (optional)
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return <div id="container-d21b7aff076d39284ab3b2f65630c5cc"></div>;
};
export default NativeBannerAd;
