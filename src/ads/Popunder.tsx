<<<<<<< HEAD
 'use client';

 import { useEffect } from 'react';

 const Popunder = () => {
   useEffect(() => {
     const script = document.createElement('script');
     script.type = 'text/javascript';
     script.src = '//conductorhimselfwhipped.com/3c/b4/35/3cb435dc9a24129af480f97b1b0ddd30.js';
     script.async = true;
     document.body.appendChild(script);

     return () => {
       document.body.removeChild(script);
     };
   }, []);

   return null;
 };

 export default Popunder;
=======
'use client';

 import { useEffect } from 'react';

 const Popunder = () => {
   useEffect(() => {
     const script = document.createElement('script');
     script.type = 'text/javascript';
     script.src = '//conductorhimselfwhipped.com/3c/b4/35/3cb435dc9a24129af480f97b1b0ddd30.js';
     script.async = true;
     document.body.appendChild(script);

     return () => {
       document.body.removeChild(script);
     };
   }, []);

   return null;
 };

 export default Popunder;
>>>>>>> d78ab8158a9c7d208b33d3b45d3577db2fb543fc
