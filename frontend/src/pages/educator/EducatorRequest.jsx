import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';

const EducatorRequest = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  //check the user role
  useEffect(() => {
    
    if (user?.publicMetadata?.role === 'educator') {
      toast.success("You have been approved as an educator!");
      navigate("/educator"); 
    }
  }, [user, navigate]); 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100/70 to-blue-200 p-6">
      <motion.div
        className="bg-white/60 backdrop-blur-lg p-10 rounded-2xl shadow-xl border border-white/30 text-center relative overflow-hidden"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        
        <motion.div
          className="absolute inset-0 border-2 border-cyan-300 rounded-2xl opacity-30"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
        ></motion.div>

        <h1 className="text-2xl font-bold text-gray-900 drop-shadow-md mb-4">
          Please wait while we process your request
        </h1>
        <motion.p
          className="text-lg text-gray-700 opacity-80"
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          We are currently reviewing your request. You will be notified soon.
        </motion.p>

        
        <div className="mt-6 flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="h-3 w-3 bg-cyan-400 rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
            ></motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EducatorRequest;