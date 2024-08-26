function summarizeDataUser(start, end, lines, users) {
    // Helper function to format the date string to a Date object
    const parseDate = (dateStr) => {
        if (dateStr.includes('-')) {
            // Handle formats like YYYY-M-D or YYYY-MM-DD
            const [year, month, day] = dateStr.split('-').map(Number);
            return new Date(year, month - 1, day);
        } else {
            // Handle formats like MM/DD/YYYY
            const [month, day, year] = dateStr.split('/').map(Number);
            return new Date(year, month - 1, day);
        }
    };

    // Convert start and end dates to Date objects if they are in string format
    const startDate = typeof start === 'string' ? parseDate(start) : new Date(start);
    const endDate = typeof end === 'string' ? parseDate(end) : new Date(end);

    // Filter lines based on date range
    const filteredLines = lines.filter(line => {
        const orderDate = parseDate(line.fieldData.Order_Date);
        return orderDate >= startDate && orderDate <= endDate;
    });

    // Create a map to store quantities and totals for each userKey
    const userStats = {};

    filteredLines.forEach(line => {
        const { userKeys, Qty, f_remake } = line.fieldData;

        // Split userKeys by line break and process each key
        const userKeyList = userKeys.split('\r').map(key => key.trim()).filter(key => key);

        userKeyList.forEach(userKey => {
            if (!userStats[userKey]) {
                userStats[userKey] = { totalQty: 0, remakeQty: 0, nonRemakeQty: 0 };
            }

            userStats[userKey].totalQty += Qty;
            if (f_remake === 1) {
                userStats[userKey].remakeQty += Qty;
            } else {
                userStats[userKey].nonRemakeQty += Qty;
            }
        });
    });

    // Map userKeys to user names
    const userMap = users.reduce((map, user) => {
        const { __kp_User, Name_First, Name_Last } = user.fieldData;
        map[__kp_User] = `${Name_First} ${Name_Last}`;
        return map;
    }, {});

    // Prepare the result array
    const result = Object.keys(userStats).map(userKey => {
        const stats = userStats[userKey];
        const name = userMap[userKey] || 'Unknown User';
        const { totalQty, remakeQty, nonRemakeQty } = stats;
        const percentage = nonRemakeQty === 0 ? 0 : (remakeQty / nonRemakeQty);
        return [name, (percentage * 100).toFixed(2) + '%', remakeQty, totalQty, userKey];
    });

    // Sort the result array by the second value (percentage) in descending order
    result.sort((a, b) => b[1] - a[1]);

    return result;
};








function summarizeDataProfile(start, end, lines) {
    // Helper function to format the date string to a Date object
    const parseDate = (dateStr) => {
        if (dateStr.includes('-')) {
            // Format: YYYY-MM-DD
            const [year, month, day] = dateStr.split('-').map(Number);
            return new Date(year, month - 1, day);
        } else {
            // Format: MM/DD/YYYY
            const [month, day, year] = dateStr.split('/').map(Number);
            return new Date(year, month - 1, day);
        }
    };

    // Convert start and end dates to Date objects if they are in string format
    const startDate = typeof start === 'string' ? parseDate(start) : new Date(start);
    const endDate = typeof end === 'string' ? parseDate(end) : new Date(end);

    // Filter lines based on date range
    const filteredLines = lines.filter(line => {
        const orderDate = parseDate(line.fieldData.Order_Date);
        return orderDate >= startDate && orderDate <= endDate;
    });

    // Create a map to store quantities and totals for each Gasket_Profile
    const gasketProfileStats = {};

    filteredLines.forEach(line => {
        const { Gasket_Profile, Qty, f_remake } = line.fieldData;

        if (!gasketProfileStats[Gasket_Profile]) {
            gasketProfileStats[Gasket_Profile] = { totalQty: 0, remakeQty: 0, nonRemakeQty: 0 };
        }

        gasketProfileStats[Gasket_Profile].totalQty += Qty;
        if (f_remake === 1) {
            gasketProfileStats[Gasket_Profile].remakeQty += Qty;
        } else {
            gasketProfileStats[Gasket_Profile].nonRemakeQty += Qty;
        }
    });

    // Prepare the result array
    const result = Object.keys(gasketProfileStats).map(profile => {
        const stats = gasketProfileStats[profile];
        const { totalQty, remakeQty, nonRemakeQty } = stats;
        const percentage = nonRemakeQty === 0 ? 0 : (remakeQty / nonRemakeQty);
        return [profile, (percentage * 100).toFixed(2) + '%', remakeQty, totalQty];
    });

    // Sort the result array by the second value (percentage) in descending order
    result.sort((a, b) => b[1] - a[1]);

    return result;
};













export { summarizeDataUser, summarizeDataProfile };
