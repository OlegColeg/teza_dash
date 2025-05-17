"use client";

import React, { useState } from "react";
import { Save, Camera, UserCheck } from "lucide-react";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    firstName: "Oală",
    lastName: "Oală",
    email: "ooale47@gmail.com",
    phone: "+373 604 35 197",
    country: "Moldova",
    city: "Bălți",
    address: "Str. Tudor Vladimirescu 45",
    role: "Main Administrator",
    department: "IT Department",
    bio: "Băiat bun, dar mai are de învățat",
  });

  const [formData, setFormData] = useState({...profileData});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfileData({...formData});
    // Here you would typically save to a database
    alert("Profile updated successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">PROFILE</h1>
          <p className="text-gray-400">Manage your account information</p>
        </div>
        <button 
          onClick={handleSubmit}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded flex items-center"
        >
          <Save size={18} className="mr-2" />
          SAVE CHANGES
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-dark-800 p-6 rounded-lg shadow">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
                <img src="/image/olegAdmin.jpg" alt="User profile" className="h-full w-full object-cover" />
              </div>
              <button className="absolute bottom-3 right-0 bg-teal-600 p-2 rounded-full text-white hover:bg-teal-700">
                <Camera size={16} />
              </button>
            </div>
            
            <h2 className="text-xl font-semibold text-white">{profileData.firstName} {profileData.lastName}</h2>
            <p className="text-sm text-gray-400">{profileData.role}</p>
            
            <div className="w-full mt-6 space-y-4">
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-sm font-medium text-gray-400">Department</h3>
                <p className="text-white">{profileData.department}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400">Contact</h3>
                <p className="text-white">{profileData.email}</p>
                <p className="text-white">{profileData.phone}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400">Location</h3>
                <p className="text-white">{profileData.city}, {profileData.country}</p>
              </div>
              
              <div className="pt-4">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center justify-center">
                  <UserCheck size={18} className="mr-2" />
                  VERIFY ACCOUNT
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Form */}
        <div className="md:col-span-2 bg-dark-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-white mb-6">Edit Profile</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-400">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 bg-dark-700 border border-gray-700 text-white rounded-md w-full p-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                />
              </div>
              
              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-400">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 bg-dark-700 border border-gray-700 text-white rounded-md w-full p-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                />
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 bg-dark-700 border border-gray-700 text-white rounded-md w-full p-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                />
              </div>
              
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-400">Phone</label>
                <input 
                  type="text" 
                  id="phone" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 bg-dark-700 border border-gray-700 text-white rounded-md w-full p-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                />
              </div>
              
              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-400">Country</label>
                <input 
                  type="text" 
                  id="country" 
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-1 bg-dark-700 border border-gray-700 text-white rounded-md w-full p-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                />
              </div>
              
              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-400">City</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 bg-dark-700 border border-gray-700 text-white rounded-md w-full p-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                />
              </div>
              
              {/* Address */}
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-400">Address</label>
                <input 
                  type="text" 
                  id="address" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 bg-dark-700 border border-gray-700 text-white rounded-md w-full p-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                />
              </div>
              
              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-400">Role</label>
                <input 
                  type="text" 
                  id="role" 
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 bg-dark-700 border border-gray-700 text-white rounded-md w-full p-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                />
              </div>
              
              {/* Department */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-400">Department</label>
                <input 
                  type="text" 
                  id="department" 
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="mt-1 bg-dark-700 border border-gray-700 text-white rounded-md w-full p-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                />
              </div>
              
              {/* Bio */}
              <div className="md:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-400">Bio</label>
                <textarea 
                  id="bio" 
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 bg-dark-700 border border-gray-700 text-white rounded-md w-full p-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                ></textarea>
              </div>
            </div>
          </form>
          
          {/* Security Settings Section */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Security Settings</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white">Two-factor Authentication</h3>
                  <p className="text-gray-400 text-sm">Enhance your account security</p>
                </div>
                <div className="flex items-center">
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white">Email Notifications</h3>
                  <p className="text-gray-400 text-sm">Receive account updates via email</p>
                </div>
                <div className="flex items-center">
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input type="checkbox" value="" checked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white">API Access</h3>
                  <p className="text-gray-400 text-sm">Allow API access to your account</p>
                </div>
                <div className="flex items-center">
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}