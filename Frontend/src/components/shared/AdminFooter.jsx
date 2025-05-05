import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-12 md:px-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">About JobPortal</h3>
          <p className="text-sm leading-6">
            JobPortal is your one-stop destination for finding your dream job or hiring top talent.
            We connect job seekers with employers, simplify applications, and streamline hiring.
          </p>
        </div>

        
        {/* For Employers */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Recruiters</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/admin/jobs/create" className="hover:text-white">Post a Job</a></li>
            <li><a href="/admin/companies" className="hover:text-white">Company Dashboard</a></li>
            <li><a href="/admin/companies/create" className="hover:text-white">New company</a></li>
            <li><a href="/profile" className="hover:text-white">profile</a></li>
            
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt /> RGUKT RK Valley, Andhra Pradesh
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt /> +91 1234567891
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope /> support@jobportal.in
            </li>
          </ul>
        </div>
      </div>

      {/* Social & Copy */}
      <div className="mt-12 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white"><FaFacebookF /></a>
          <a href="#" className="hover:text-white"><FaTwitter /></a>
          <a href="#" className="hover:text-white"><FaInstagram /></a>
          <a href="#" className="hover:text-white"><FaLinkedinIn /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
