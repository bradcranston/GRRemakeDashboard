


function createTable(table,columns,data) {


  let tableDT = new DataTable(table, {
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


  window.callFM = function (result) {
    FileMaker.PerformScript("RMK_G002 - Dashboard load wv", JSON.stringify(result));
    event.stopPropagation();
  };
  
  $(".dataTable").on("click", "tbody tr", function () {
    let build = {
      data: tableDT.row(this).data(),
      mode: "navTable",
    };
    callFM(build);
    event.stopPropagation();
  });


};

export { createTable };
