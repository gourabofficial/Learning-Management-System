import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { Code } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const isCoursePage = location.pathname.includes("/course-list");

  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const { isEducator } = useContext(AppContext);

  const becomeEducator = () => {
    if (isEducator) {
      toast.success("Navigating to Educator Dashboard");
      navigate("/educator");
    } else {
      toast.success("After approval, you will be an Educator on CourseHub");
      navigate("/educator-request");
    }
  };

  return (
    <div
      className={`flex justify-between items-center px-5 sm:px-10 md:px-14 lg:px-36 
    py-4 border-b border-gray-500 ${isCoursePage ? "bg-white" : "bg-cyan-100/70"}`}
    >
      <Link to="/" className="flex items-center justify-center space-x-3 hover:text-[#000000] transition-colors duration-300">
        <Code className="w-10 h-10 text-[#000000] font-extrabold" />
        <h1 className="text-2xl hidden lg:block font-bold lg:font-bold text-[#000000]">
          CourseHub
        </h1>
      </Link>

      <div className="hidden md:flex items-center gap-5 text-gray-500">
        {user && (
          <>
            <button onClick={becomeEducator}>
              {isEducator ? "Educator Dashboard" : "Become an Educator"}
            </button>
            | <Link to="/my-enrollments">My Enrollments</Link>
          </>
        )}

        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={openSignIn}
            className="bg-blue-600 text-white px-5 py-2 rounded-full"
          >
            Create Account
          </button>
        )}
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
        {user && (
          <>
            <button onClick={becomeEducator}>
              {isEducator ? "Educator Dashboard" : "Become an Educator"}
            </button>
            | <Link to="/my-enrollments">My Enrollments</Link>
          </>
        )}

        {user ? (
          <UserButton />
        ) : (
          <button onClick={openSignIn}>
            <img src="/assets/user_icon.png" alt="User Icon" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
