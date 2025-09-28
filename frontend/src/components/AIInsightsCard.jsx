import {useState, useEffect} from "react";
import {Lightbulb} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import {API_PATHS} from "../utils/apiPaths";

const AIInsightsCard = () => {
    const [insights, setInsights] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AI.GET_DASHBOARD_SUMMARY);
                setInsights(response.data.insights || []);
            } catch (error) {
                console.error("Failed to fetch AI insights", error);
                setInsights([]); // Set empty array on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchInsights();
    }, []);

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-gray-100">
            <div className="flex items-center mb-4">
                <Lightbulb className="w-6 h-6 text-yellow-500 mr-3" />
                <h3 className="text-lg font-semibold text-slate-900">AI Insights</h3>
            </div>
            {isLoading ? (
                <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
            ) : (
                <ul className="space-y-3 list-disc list-inside text-slate-600 ml-3">
                    {insights.map((insight, index) => (
                        <li className="text-sm" key={index}>
                            {insight}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AIInsightsCard;
