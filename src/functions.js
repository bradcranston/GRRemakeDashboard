function processGasketData(startDate, endDate, lines) {
    // Helper function to parse dates
    function parseDate(dateStr) {
        return new Date(dateStr);
    }

    // Convert startDate and endDate to Date objects
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    end.setHours(23, 59, 59, 999);

    console.log(lines);

    //console.log({'start':start,'end':end})

    // Arrays to hold filtered data
    const gasketsMade = [];
    const gasketsRemade = [];

    // Filter lines into gasketsMade and gasketsRemade arrays
    for (const line of lines) {
        const orderDate = parseDate(line.fieldData.Order_Date);
        const { f_remade, f_itemGasket, OrderPrice } = line.fieldData;
        
        // Check if it's a remake: either f_remade === 1 OR (OrderPrice is 0/empty AND f_itemGasket === 1)
        const isRemade = f_remade === 1 || ((OrderPrice === 0 || OrderPrice === "" || OrderPrice == null) && f_itemGasket === 1);
        
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
