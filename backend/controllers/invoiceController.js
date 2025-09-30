const Invoice = require("../models/Invoice");

exports.createInvoice = async (req, res) => {
    try {
        const user = req.user;
        const {invoiceNumber, invoiceDate, dueDate, billFrom, billTo, items, notes, paymentTerms} = req.body;

        // Subtotal Calculation
        let subtotal = 0;
        let taxTotal = 0;

        items.forEach((item) => {
            subtotal += item.unitPrice * item.quantity;
            taxTotal += (item.unitPrice * item.quantity * (item.taxPercent || 0)) / 100;
        });

        const total = subtotal + taxTotal;

        const invoice = new Invoice({
            user,
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
            subtotal,
            taxTotal,
            total,
        });

        await invoice.save();
        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({message: "Error creating invoice", error: error.message});
    }
};

exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({user: req.user.id}).populate("user", "name email");
        res.json(invoices);
    } catch (error) {
        res.status(500).json({message: "Error fetching invoice", error: error.message});
    }
};

exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate("user", "name email");
        if (!invoice) return res.status(404).json({message: "Invoice Not Found"});

        // Check if the invoice belongs to the user
        if(invoice.user.toString() !== req.user.id){
            return res.status(401).json({message : "Not Authorized"})
        }


        res.json(invoice);
    } catch (error) {
        res.status(500).json({message: "Error fetching invoice", error: error.message});
    }
};

exports.updateInvoice = async (req, res) => {
  try {
    const { invoiceNumber, invoiceDate, dueDate, billFrom, billTo, items, notes, paymentTerms, status } = req.body;

    // Fetch existing invoice
    const existingInvoice = await Invoice.findById(req.params.id);
    if (!existingInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    let subtotal = existingInvoice.subtotal;
    let taxTotal = existingInvoice.taxTotal;
    let total = existingInvoice.total;

    // Recalculate only if items were passed
    if (items && items.length > 0) {
      subtotal = 0;
      taxTotal = 0;

      items.forEach((item) => {
        subtotal += item.unitPrice * item.quantity;
        taxTotal += (item.unitPrice * item.quantity * (item.taxPercent || 0)) / 100;
      });

      total = subtotal + taxTotal;
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        invoiceNumber: invoiceNumber ?? existingInvoice.invoiceNumber,
        invoiceDate: invoiceDate ?? existingInvoice.invoiceDate,
        dueDate: dueDate ?? existingInvoice.dueDate,
        billFrom: billFrom ?? existingInvoice.billFrom,
        billTo: billTo ?? existingInvoice.billTo,
        items: items ?? existingInvoice.items,
        notes: notes ?? existingInvoice.notes,
        paymentTerms: paymentTerms ?? existingInvoice.paymentTerms,
        status: status ?? existingInvoice.status,
        subtotal,
        taxTotal,
        total,
      },
      { new: true }
    );

    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ message: "Error updating invoice", error: error.message });
  }
};


exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id)
        if(!invoice) return res.status(404).json({message : "Invoice Not Found"})
        res.json({message : "Invoice Deleted Successfully"})
    } catch (error) {
        res.status(500).json({message: "Error deleting invoice", error: error.message});
    }
};





