function summarizeDataUser(start, end, lines, users, mode = 'mp') {
  // Helper function to format the date string to a Date object
  const parseDate = (dateStr) => {
    if (dateStr.includes("-")) {
      // Handle formats like YYYY-M-D or YYYY-MM-DD
      const [year, month, day] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day);
    } else {
      // Handle formats like MM/DD/YYYY
      const [month, day, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day);
    }
  };

  // Convert start and end dates to Date objects if they are in string format
  const startDate =
    typeof start === "string" ? parseDate(start) : new Date(start);
  const endDate = typeof end === "string" ? parseDate(end) : new Date(end);

  endDate.setHours(23, 59, 59, 999);

  // Filter lines based on date range
  const filteredLines = lines.filter((line) => {
    const orderDate = parseDate(line.fieldData.Order_Date);
    return orderDate >= startDate && orderDate <= endDate;
  });

  // Create a map to store quantities and totals for each userKey
  const userStats = {};



  filteredLines.forEach((line) => {
    const { MPKey, userKeys, Qty, f_remade, f_itemGasket, OrderPrice } = line.fieldData;

    // Determine which keys to process based on mode
    let keysToProcess = [];
    
    if (mode === 'mp') {
      // MPs mode: use MPKey
      if (MPKey !== null && MPKey !== undefined && MPKey !== '') {
        keysToProcess = [String(MPKey).trim()];
      }
    } else if (mode === 'all') {
      // All Users mode: use userKeys (return-separated list)
      if (userKeys !== null && userKeys !== undefined && userKeys !== '') {
        keysToProcess = String(userKeys).split('\r').map(key => key.trim()).filter(key => key !== '');
      }
    }

    // Process each key
    keysToProcess.forEach(userKey => {
      if (!userStats[userKey]) {
        userStats[userKey] = { totalQty: 0, remakeQty: 0, nonRemakeQty: 0, totalLines: 0, remakeLines: 0 };
      }

      userStats[userKey].totalQty += Qty;
      userStats[userKey].totalLines += 1;
      
      // Check if it's a remake: either f_remade === 1 OR (OrderPrice is 0/empty AND f_itemGasket === 1)
      const isRemade = f_remade === 1 || f_remade === "1";
      const isGasketRemake = ((OrderPrice === 0 || OrderPrice === "" || OrderPrice == null) && f_itemGasket === 1);
      const isRemake = isRemade || isGasketRemake;
      
      if (isRemake) {
        userStats[userKey].remakeQty += Qty;
        userStats[userKey].remakeLines += 1;
      } else {
        userStats[userKey].nonRemakeQty += Qty;
      }
    });
  });



  // Map __kp_User to user names
  // MPKey from lines data will match to __kp_User from user data
  const userMap = users.reduce((map, user) => {
    const { __kp_User, Name_First, Name_Last } = user.fieldData;
    map[__kp_User] = `${Name_First} ${Name_Last}`;
    return map;
  }, {});

  // Prepare the result array
  const result = Object.keys(userStats).map((userKey) => {
    const stats = userStats[userKey];
    const name = userMap[userKey] || userKey;
    const { totalQty, remakeQty } = stats;
    const percentage = totalQty === 0 ? 0 : remakeQty / totalQty;

    return [
      name,
      (percentage * 100).toFixed(2) + "%",
      remakeQty,
      userKey,
      "user"
    ];
  });

  // Sort the result array by the second value (percentage) in descending order
  result.sort((a, b) => b[1] - a[1]);

  return result;
}


function summarizeDataProfile(start, end, lines) {
  // Helper function to format the date string to a Date object
  const parseDate = (dateStr) => {
    if (dateStr.includes("-")) {
      // Format: YYYY-MM-DD
      const [year, month, day] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day);
    } else {
      // Format: MM/DD/YYYY
      const [month, day, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day);
    }
  };

  // Convert start and end dates to Date objects if they are in string format
  const startDate =
    typeof start === "string" ? parseDate(start) : new Date(start);
  const endDate = typeof end === "string" ? parseDate(end) : new Date(end);
  endDate.setHours(23, 59, 59, 999);

  // Filter lines based on date range
  const filteredLines = lines.filter((line) => {
    const orderDate = parseDate(line.fieldData.Order_Date);
    return orderDate >= startDate && orderDate <= endDate;
  });

  // Create a map to store quantities and totals for each Gasket_Profile
  const gasketProfileStats = {};

  filteredLines.forEach((line) => {
    const { Gasket_Profile, Qty, f_remade, f_itemGasket, OrderPrice } = line.fieldData;

    if (!gasketProfileStats[Gasket_Profile]) {
      gasketProfileStats[Gasket_Profile] = {
        totalQty: 0,
        remakeQty: 0,
        nonRemakeQty: 0,
        totalLines: 0,
        remakeLines: 0,
      };
    }

    gasketProfileStats[Gasket_Profile].totalQty += Qty;
    gasketProfileStats[Gasket_Profile].totalLines += 1;
    
    // Check if it's a remake: either f_remade === 1 OR (OrderPrice is 0/empty AND f_itemGasket === 1)
    const isRemade = f_remade === 1 || f_remade === "1";
    const isGasketRemake = ((OrderPrice === 0 || OrderPrice === "" || OrderPrice == null) && f_itemGasket === 1);
    const isRemake = isRemade || isGasketRemake;
    
    if (isRemake) {
      gasketProfileStats[Gasket_Profile].remakeQty += Qty;
      gasketProfileStats[Gasket_Profile].remakeLines += 1;
    } else {
      gasketProfileStats[Gasket_Profile].nonRemakeQty += Qty;
    }
  });

  // Prepare the result array
  const result = Object.keys(gasketProfileStats).map((profile) => {
    const stats = gasketProfileStats[profile];
    const { totalQty, remakeQty } = stats;
    const percentage = totalQty === 0 ? 0 : remakeQty / totalQty;
    return [profile, (percentage * 100).toFixed(2) + "%", remakeQty];
  });

  // Sort the result array by the second value (percentage) in descending order
  result.sort((a, b) => b[1] - a[1]);

  return result;
};

export { summarizeDataUser, summarizeDataProfile };
