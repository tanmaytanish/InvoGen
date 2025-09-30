import React, {useState, useEffect} from "react";
import {useAuth} from "../../context/AuthContext";
import {Loader2, User, Mail, Building, Phone, MapPin, LucideBuilding2} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import {API_PATHS} from "../../utils/apiPaths";
import toast from "react-hot-toast";
import InputField from "../../components/ui/InputField";
import TextareaField from "../../components/ui/TextAreaField";

const ProfilePage = () => {
    const {user, loading, updateUser} = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        businessName: "",
        address: "",
        phone: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                businessName: user.businessName || "",
                address: user.address || "",
                phone: user.phone || "",
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleUpdateProfile = async (e) => {
      e.preventDefault();
      setIsUpdating(true);

      try {
        const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE,formData)
        updateUser(response.data)
        toast.success("Profile Updated Successfully")
      } catch (error) {
        toast.error("Failed to update profile")
        console.error(error)
      }finally{
        setIsUpdating(false)
      }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-96 space-y-6">
                {/* Main Spinner with glow */}
                <div className="relative flex flex-col items-center space-y-4">
                    <div className="relative">
                        <Loader2 className="w-25 h-25 animate-spin text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text" />
                        <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-2xl opacity-50 animate-pulse"></div>
                    </div>

                    {/* Smaller spinner */}
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500 opacity-80" />
                </div>

                {/* Gradient loading text */}
                <p className="text-lg font-semibold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text animate-pulse">
                    Loading your Invoice...
                </p>

                {/* Friendly subtext */}
                <p className="text-sm text-gray-500 dark:text-gray-500">Please wait a moment ✨</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden max-w-4xl mx-auto">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-lg font-semibold text-slate-900">My Profile</h3>
            </div>

            <form onSubmit={handleUpdateProfile}>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="w-5 h-5 text-slate-400" />
                          </div>

                          <input type="email" readOnly value={user?.email || ''} className="w-full h-10 pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 disabled:cursor-not-allowed" disabled />
                        </div>
                    </div>

                    <InputField label="Full Name" name="name" icon={User} type="text" value={formData.name} onChange={handleInputChange} placeholder="Enter your Full Name" />

                    <div className="pt-6 border-t border-slate-200">
                      <h4 className="text-lg font-medium text-slate-900">Business Information</h4>
                      <p className="text-sm text-slate-500 mt-1 mb-4">This will be used to pre-fill the "Bill From" section of your Invoices</p>
                      <div className="space-y-4 ">
                        <InputField label="Business Name" name="businessName" icon={LucideBuilding2} type="text" value={formData.businessName} onChange={handleInputChange} placeholder="Your Company LLC" />
                        <TextareaField label="Address" name="address" icon={MapPin} value={formData.address} onChange={handleInputChange} placeholder="Unit-4 Market, Bhubaneswar, India" />
                        <InputField label="Phone" name="phone" icon={Phone} type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+91 84580 08599" />
                      </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                  <button type="submit" disabled={isUpdating} className="inline-flex items-center justify-center px-4 py-2 h-10 bg-blue-900 hover:bg-blue-800 text-white font-medium text-sm rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disaabled:cursor-not-allowed" >
                    {isUpdating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
            </form>
        </div>
    );
};

export default ProfilePage;
