const {GoogleGenAI} = require("@google/genai")
const Invoice = require("../models/Invoice")



const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

const parseInvoiceFromText = async (req,res) => {
    const { text } = req.body

    if(!text){
        return res.status(400).json({message : "Text is required"})

    }

    try {
        
        const prompt = 
        `You are an expert invoice data extraction AI. Analyze the following text and extract the relevant information to create an Invoice.
        The output MUST be a valid JSON object.
        
        The JSON object should have the following structure:
        {
            "clientName" : "string",
            "email" : "string (if available)",
            "address" : "string (if available)",
            "items" : [
                {
                    "name" : "string",
                    "quantity" : "number",
                    "unitPrice" : "number"
                }
            ]
        }

        Here is the text to parse:
        
        ---TEXT START---
        ${text}
        ---TEXT END---
        
        Extract the data and provide only the JSON Object.`;

        const response  = await ai.models.generateContent({
            model : "gemini-2.0-flash-001",
            contents : prompt,
        })

        const responseText = response.text;

        if(typeof responseText !== 'string'){
            if(typeof response.text === 'function'){
                responseText = response.text();
            }else{
                throw new Error('Could not extract text from AI response.');
            }
        }


        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const parsedData = JSON.parse(cleanedJson);

        res.status(200).json(parsedData)
    } catch (error) {
        console.error("Error Parsing Invoice With AI : ",error)
        res.status(500).json({message : "Failed to parse invoice data from the text.",details : error.message})
    }
}


const generateReminderEmail = async (req,res) => {

    const {invoiceId} = req.body;

    if(!invoiceId){
        return res.status(400).json({message : "Invoice ID is required"})
    }

    try {
        
        const invoice = await Invoice.findById(invoiceId);
        if(!invoice){
            return res.status(404).json({message : "Invoice Not Found"})
        }
        const prompt = 
        `You are a professional and polite accounting assistant. Write a friendly reminder emial to a client about an overdue or upcoming invoice payment.
        
        Use the following details to personalize the email:
            - Client Name : ${invoice.billTo.clientName}
            - Invoice Number : ${invoice.invoiceNumber}
            - Amount Due : ${invoice.total.toFixed(2)}
            - Due Date : ${new Date(invoice.dueDate).toLocaleDateString()}
            
            The tone should be friendly and clear. Keep it concise. Start the email with "Subject"`;

        const response  = await ai.models.generateContent({
            model : "gemini-2.0-flash-001",
            contents : prompt,
        })

        

        res.status(200).json({reminderText : response.text})


    } catch (error) {
        console.error("Error Generating Reminder Email with AI : ",error)
        res.status(500).json({message : "Failed to parse invoice data from the text.",details : error.message})
    }
}



const getDashboardSummary = async (req,res) => {
    try {
        
    } catch (error) {
        console.error("Error Fetching Dashboard Summary With AI : ",error)
        res.status(500).json({message : "Failed to parse invoice data from the text.",details : error.message})
    }
}


module.exports = { parseInvoiceFromText, generateReminderEmail, getDashboardSummary }
