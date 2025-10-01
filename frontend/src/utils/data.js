import { BarChart2, FileText, LayoutDashboard, Mail, Plus, Sparkles, Users } from "lucide-react";

export const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Invoice Creation",
    description:
      "Paste any text, email, or receipt, and let our AI instantly generate a complete, professional invoice for you.",
  },
  {
    icon: BarChart2,
    title: "AI-Powered Dashboard",
    description:
      "Get smart, actionable insights about your business finances, generated automatically by AI.",
  },
  {
    icon: Mail,
    title: "Smart Reminders",
    description:
      "Automatically generate polite and effective payment reminder emails for overdue invoices.",
  },
  {
    icon: FileText,
    title: "Easy Invoice Management",
    description:
      "Easily manage all your invoices, track payments, and send reminders for overdue payments.",
  },
];

export const TESTIMONIALS = [
  {
    quote: "This app saved me hours of work. I can now create and send invoices in minutes!",
    author: "Debesh Behera",
    title: "Freelance Designer",
    avatar: "https://placehold.co/100x100/000000/ffffff?text=DB"
  },
  {
    quote: "The best invoicing app I have ever used. Simple, intuitive, and powerful.",
    author: "Lokesh Reddy",
    title: "Small Business Owner",
    avatar: "https://placehold.co/100x100/000000/ffffff?text=LR"
  },
  {
    quote: "I love the dashboard and reporting features. It helps me keep track of my finances easily.",
    author: "Ashutosh Sahoo",
    title: "Consultant",
    avatar: "https://placehold.co/100x100/000000/ffffff?text=AS"
  }
];

export const FAQS = [
    {
    question: "How does the AI invoice creation work?",
    answer: "Simply paste any text that contains invoice details - like an email, a list of items, or a work summary & our AI will instantly parse it to pre-fill a new invoice for you, saving your time and effort."
  }, {
    question: "Is my data secure?",
    answer: "Yes, we take data security seriously and use industry-standard measures to protect your information."
  }, {
    question: "Can I customize the invoice templates?",
    answer: "Yes, we offer a variety of templates that you can customize to fit your brand."
  }, {
    question: "How do I send payment reminders?",
    answer: "You can set up automatic reminders or send them manually through the app."  
  }    
]

// navigation iytems configuration
export const NAVIGATION_MENU = [
  { id : "dashboard", name : "Dashbaord", icon : LayoutDashboard},
  { id : "invoices", name : "Invoices", icon : FileText},
  { id : "invoices/new", name : "Create Invoice", icon : Plus},
  { id : "profile", name : "Profile", icon : Users},
]