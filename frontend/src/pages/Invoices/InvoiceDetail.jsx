import React, {useState, useEffect, useRef} from "react";
import {useParams, useNavigate} from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {API_PATHS} from "../../utils/apiPaths";
import {Loader2, Edit, Printer, AlertCircle, Mail} from "lucide-react";
import toast from "react-hot-toast";
import CreateInvoice from "./CreateInvoice";
import Button from "../../components/ui/Button";
import ReminderModal from "../../components/invoices/ReminderModal";

const InvoiceDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
    const invoiceRef = useRef();

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.INVOICE.GET_INVOICE_BY_ID(id));
                setInvoice(response.data);
            } catch (err) {
                toast.error("Failed to fetch your invoice");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [id]);

    const handleUpdate = async (formData) => {
        try {
            const response = await axiosInstance.put(API_PATHS.INVOICE.UPDATE_INVOICE(id), formData);
            toast.success("Invoice Updated Successfully !");
            setIsEditing(false);
            setInvoice(response.data);
        } catch (error) {
            toast.error("Failed to Update Invoice");
            console.error(error);
        }
    };

    const handlePrint = () => {
        window.print();
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

    if (!invoice) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-lg">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Invoice Not Found</h3>
                <p className="text-slate-500 mb-6 max-w-md">
                    The Invoice You Are Looking For Doesn't Exist or Couldn't Be Loaded !!
                </p>
                <Button onClick={() => navigate("/invoices")}>Back to All Invoices</Button>
            </div>
        );
    }

    if (isEditing) {
        return <CreateInvoice existingInvoice={invoice} onSave={handleUpdate} />;
    }

    return (
        <>
            <ReminderModal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} invoiceId={id} />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 print:hidden">
                <h1 className="text-2xl font-semibold text-slate-900 mb-4 sm:mb-0">
                    Invoice <span className="font-mono text-slate-500">{invoice.invoiceNumber}</span>
                </h1>
                <div className="flex items-center gap-2">
                    {invoice.status !== "Paid" && (
                        <Button variant="secondary" onClick={() => setIsReminderModalOpen(true)} icon={Mail}>
                            Generate Reminder
                        </Button>
                    )}
                    <Button variant="secondary" onClick={() => setIsEditing(true)} icon={Edit}>
                        Edit
                    </Button>
                    <Button variant="primary" onClick={handlePrint} icon={Printer}>
                        Print or Download
                    </Button>
                </div>
            </div>

            <div id="invoice-content-wrapper">
                <div
                    className="bg-white p-6 sm:p-8 md:p-12 rounded-lg shadow-md border border-slate-200 pb-[100vh]"
                    ref={invoiceRef}
                    id="invoice-preview"
                >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start pb-8 border-b border-slate-200">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">INVOICE</h2>
                            <p className="text-sm text-slate-500 mt-2"># {invoice.invoiceNumber}</p>
                        </div>
                        <div className="text-left sm:text-right mt-4 sm:mt-0">
                            <p className="text-sm text-slate-500">Status</p>
                            <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    invoice.status === "Paid"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : invoice.status === "Pending"
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                            >
                                {invoice.status}
                            </span>
                        </div>
                    </div>

                    {/* Bill From / Bill To inside white box */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-8">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                Bill From
                            </h3>
                            <p className="font-semibold text-slate-800">{invoice.billFrom.businessName}</p>
                            <p className="text-slate-600">{invoice.billFrom.address}</p>
                            <p className="text-slate-600">{invoice.billFrom.email}</p>
                            <p className="text-slate-600">{invoice.billFrom.phone}</p>
                        </div>
                        <div className="sm:text-right">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                Bill To
                            </h3>
                            <p className="font-semibold text-slate-800">{invoice.billTo.clientName}</p>
                            <p className="text-slate-600">{invoice.billTo.address}</p>
                            <p className="text-slate-600">{invoice.billTo.email}</p>
                            <p className="text-slate-600">{invoice.billTo.phone}</p>
                        </div>
                    </div>

                    {/* Add item table or other invoice info inside here as needed */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 my-8">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                Invoice Date
                            </h3>
                            <p className="font-medium text-slate-800">
                                {new Date(invoice.invoiceDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                Due Date
                            </h3>
                            <p className="font-medium text-slate-800">
                                {new Date(invoice.dueDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 text-right uppercase tracking-wider mb-3">
                                Payment Terms
                            </h3>
                            <p className="font-medium text-right text-slate-800">{invoice.paymentTerms}</p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                        Item
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                                        Qty
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                                        Total
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-slate-200">
                                {invoice.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 sm:px-6 py-4 text-sm font-medium text-slate-900">
                                            {item.name}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-center font-medium text-slate-600">
                                            {item.quantity}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-right font-medium text-slate-600">
                                            ${item.unitPrice.toFixed(2)}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-right font-medium text-slate-900">
                                            ${item.total.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end mt-8">
                        <div className="w-full max-w-sm space-y-3">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Subtotal</span>
                                <span>${invoice.subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Tax</span>
                                <span>${invoice.taxTotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between font-semibold text-lg text-slate-900 pt-3 mt-3">
      <span>Total</span>
      <span>${invoice.total.toFixed(2)}</span>
    </div>
                        </div>
                    </div>

                    {invoice.notes && (
                        <div className="mt-8 pt-8 border-t border-slate-200">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                Notes
                            </h3>
                            <p className="text-sm text-slate-600">{invoice.notes}</p>
                        </div>
                    )}

                    {/* Footer - Hidden on screen, visible in print */}
                    <div className="hidden print:block mt-12 pt-6 text-center text-xs text-slate-200 ">
  Created by <span className="font-semibold">InvoGen</span>
</div>
                </div>
            </div>

            <style>
    {`
      @page {
        padding: 10px;
      }

      @media print {
        body * {
          visibility: hidden;
        }
        
        #invoice-content-wrapper,
        #invoice-content-wrapper * {
          visibility: visible;
        }

        #invoice-content-wrapper {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          width: 100%;
        }

        #invoice-preview {
          box-shadow: none;
          border: none;
          border-radius: 0;
          padding: 20px;
        }
      }
    `}
  </style>
        </>
    );
};

export default InvoiceDetail;