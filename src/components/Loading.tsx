import { Loader2 } from "lucide-react";

const Loading = () => {
    return (
        <div className="loading">
            <Loader2 size={28} className="spinner" />
            <span>Loading status data...</span>
        </div>
    );
};

export default Loading;