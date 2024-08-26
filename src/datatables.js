


function createTable(table,columns,data) {


new DataTable(table, {
    data: data,
    paging: false,
    fixedHeader: true,
    scrollCollapse: true,
    scrollY: "150px",
    "dom": "<'top'ipl>rt<'bottom'<'clear'>>",
    "bInfo" : false,
    order: [[1, 'desc']],
    columns: columns
  });

};

export { createTable };
