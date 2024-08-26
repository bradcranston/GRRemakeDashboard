function processGasketData(startDate, endDate, lines) {
    // Helper function to parse dates
    function parseDate(dateStr) {
        return new Date(dateStr);
    }

    // Convert startDate and endDate to Date objects
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    // Arrays to hold filtered data
    const gasketsMade = [];
    const gasketsRemade = [];

    // Filter lines into gasketsMade and gasketsRemade arrays
    for (const line of lines) {
        const orderDate = parseDate(line.fieldData.Order_Date);
        const isRemade = line.fieldData.f_remade === 1;
        
        if (orderDate >= start && orderDate <= end) {
            if (isRemade) {
                gasketsRemade.push(line);
            } else {
                gasketsMade.push(line);
            }
        }
    }

    // Calculate gasketsMadeTotal
    const gasketsMadeTotal = gasketsMade.reduce((total, line) => total + (line.fieldData.Qty || 0), 0);

    // Calculate gasketsRemadeTotal (assuming you want to use the same method for calculating remade quantity)
    const gasketsRemadeTotal = gasketsRemade.reduce((total, line) => total + (line.fieldData.Qty || 0), 0);

    // Calculate remakePercent
    const remakePercent = gasketsMadeTotal > 0 ? (gasketsRemadeTotal / gasketsMadeTotal) * 100 : 0;

    // Calculate shipCost
    const shipCost = gasketsRemade.reduce((total, line) => total + (line.fieldData.shipCost || 0), 0);

    return {
        gasketsMade,
        gasketsRemade,
        gasketsMadeTotal,
        gasketsRemadeTotal,
        remakePercent,
        shipCost
    };
};


export { processGasketData };
