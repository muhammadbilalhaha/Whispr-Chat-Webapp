const KpiCards = ({ analyticsData }) => {
    if (!analyticsData) return null;

    return (
        <div className="flex gap-4 p-2 w-full">
            {/* Total Users */}
            <div className="flex-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg p-4 shadow-md">
                <h4 className="text-sm font-medium text-blue-100">Total Users</h4>
                <div className="text-2xl font-bold mt-1">{analyticsData.totalUsers}</div>
            </div>

            {/* Total Messages */}
            <div className="flex-1 bg-gradient-to-r from-green-600 to-green-400 text-white rounded-lg p-4 shadow-md">
                <h4 className="text-sm font-medium text-green-100">Total Messages</h4>
                <div className="text-2xl font-bold mt-1">{analyticsData.totalMessages}</div>
            </div>

            {/* Session Rate */}
            <div className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-300 text-white rounded-lg p-4 shadow-md">
                <h4 className="text-sm font-medium text-yellow-100">Session Rate</h4>
                <div className="text-2xl font-bold mt-1">{analyticsData.activeUsers}</div>
            </div>

            {/* Conversion Rate */}
            <div className="flex-1 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg p-4 shadow-md">
                <h4 className="text-sm font-medium text-purple-100">Conversion Rate</h4>
                <div className="text-2xl font-bold mt-1">{analyticsData.conversionRate}</div>
            </div>
        </div>
    );
};

export default KpiCards;
