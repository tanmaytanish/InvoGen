import React, {useState, useEffect} from "react";
import {Loader2, Mail, Copy, Check} from "lucide-react";
import Button from "../ui/Button";
import TextareaField from "../ui/TextAreaField";
import axiosInstance from "../../utils/axiosInstance";
import {API_PATHS} from "../../utils/apiPaths";
import toast from "react-hot-toast";

const ReminderModal = ({isOpen, onClose,invoiceId}) => {
    const [reminderText, setReminderText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    useEffect(() => {
        if (isOpen && invoiceId) {
            const generateReminder = async () => {
                setIsLoading(true);
                setReminderText("");
                try {
                    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_REMINDER, {invoiceId});
                    setReminderText(response.data.reminderText);
                }catch(err){
                    toast.error('Failed to Generate Reminder')
                    console.error("AI reminder error",err);
                    onClose()
                }finally{
                    setIsLoading(false)
                }
            };
            generateReminder()
        }
    }, [isOpen, invoiceId, onClose]);

    const handleCopyToClipbaord = () => {
        navigator.clipboard.writeText(reminderText);
        setHasCopied(true);
        toast.success("Reminder Copied to Clipboard !")
        setTimeout(()=> setHasCopied(false),2000)
    }

    if(!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
                <div className="fixed inset-0 bg-black/10 bg-opacity-50 transition-opacity" onClick={onClose}></div>
                
                <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative text-left transform transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                            <Mail className="w-5 h-5 mr-2 text-blue-900" />
                            AI-Generated Reminder
                        </h3>

                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">&times;</button>
                    </div>

                    {
                        isLoading ? (
                            <div className="flex justify-center items-center h-48">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <TextareaField 
                                    name="reminderText"
                                    value={reminderText}
                                    readOnly
                                    rows={10}
                                />
                            </div>
                        )
                    }

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button variant="secondary" onClick={onClose}>Close</Button>
                        <Button onClick={handleCopyToClipbaord} icon={hasCopied ? Check : Copy} disabled={isLoading}>
                            {hasCopied ? 'Copied' : 'Copy Text'}
                        </Button>

                        
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default ReminderModal;
