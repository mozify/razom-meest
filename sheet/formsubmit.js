const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var formData = null;

window.onload = function() {
  var now = new Date();
  document.getElementById('date').innerHTML =
    monthNames[now.getMonth()] + ' ' +
	now.getDate() + ', ' +
	now.getFullYear();
  addRows(5);

  var packingListForm = document.getElementById('packingList');
  packingListForm.target = 'response_iframe';
  packingListForm.addEventListener("submit", function(event) {
	  formData = new FormData(event.target);
  });
  
  var iframe = document.getElementById('response_iframe');
   if (iframe) {
     iframe.onload = function () {
	   printPreview();
     }
   }
   
  var moreRowsButton = document.getElementById('rows_button');
  moreRowsButton.addEventListener("click", function() { return addRows(5) });

  var uploadButton = document.getElementById('upload');
  uploadButton.addEventListener("click", uploadSpreadsheet);
  
  var fileUploadButton = document.getElementById('fileUpload');
  fileUploadButton.addEventListener("click", function() {
	  document.getElementById("fileUpload").value = "";
  });
}

function addRows(numRowsToAdd) {
	if (numRowsToAdd < 1) {
		return;
	}
	var table = document.getElementById("items_table");
	var rowNum = Math.max(table.rows.length-1, 0);
	for (var i = 0; i < numRowsToAdd; i++) {
		var row = table.insertRow(-1);
		row.classList.add('c4');
		var id = 'item' + (rowNum+i);
		row.id = id;
		
		row.innerHTML = `
		  <td class="c10" colspan="1" rowspan="1">
		    <input type="text" id="` + id + `_item" name="` + id + `_item" size="20">
	      </td>
		  <td class="c6" colspan="1" rowspan="1">
		    <input type="text" id="` + id + `_desc" name="` + id + `_desc" size="35">
		  </td>
		  <td class="c3" colspan="1" rowspan="1">
		    <input type="text" id="` + id + `_qty" name="` + id + `_qty" size="10">
		  </td>`;
	}
}

function printPreview() {
  if (formData === null) {
	  alert('Form has not been submitted');
	  return;
  }
  
  var orgName = formData.get('org_name');
  var fromAddress = formData.get('address');
  var phoneNum = formData.get('phone');
  var fromInfo = document.getElementById("frominfo");
  fromInfo.innerHTML = '<p class="c12"><span class="c22">From:</span></p>' +
    '<p class="c12"><span class="c2">' + orgName + '</span></p>' +
	'<p class="c12"><span class="c2">' + fromAddress + '</span></p>' +
	'<p class="c12"><span class="c2">Phone: ' + phoneNum + '</span></p>';
  
  var table = document.getElementById("items_table");
  var rowCount = Math.max(table.rows.length-1, 0);
  for (let i = 0; i < rowCount; i++) {
	var id = 'item' + i;
	var item = formData.get(id + '_item');
	var desc = formData.get(id + '_desc');
	var qty = formData.get(id + '_qty');
	var row = document.getElementById(id);
	if (item === "") {
		item = "&nbsp;";
	}
	if (desc === "") {
		desc = "&nbsp;";
	}
	if (qty === "") {
		qty = "&nbsp;";
	}
	document.getElementById("item" + i).innerHTML =
	  '<td class="c10" colspan="1" rowspan="1"><p class="c1"><span class="c0">' + item + '</span></p></td>' +
	  '<td class="c6" colspan="1" rowspan="1"><p class="c1"><span class="c0">' + desc + '</span></p></td>' + 
	  '<td class="c3" colspan="1" rowspan="1"><p class="c1"><span class="c0">' + qty + '</span></p></td>';
  }
    
  document.getElementById("instructions").style.display = "none";
  document.getElementById("actions").style.display = "none";
}

function uploadSpreadsheet() {
	var fileUpload = document.getElementById("fileUpload");

	// Validate whether File is valid Excel file.
	var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
	if (regex.test(fileUpload.value.toLowerCase())) {
		if (typeof (FileReader) != "undefined") {
			var reader = new FileReader();

			// For Browsers other than IE.
			if (reader.readAsBinaryString) {
				reader.onload = function (e) {
					getTableFromExcel(e.target.result);
				};
				reader.readAsBinaryString(fileUpload.files[0]);
			} else {
				// For IE Browser.
				reader.onload = function (e) {
					var data = "";
					var bytes = new Uint8Array(e.target.result);
					for (var i = 0; i < bytes.byteLength; i++) {
						data += String.fromCharCode(bytes[i]);
					}
					getTableFromExcel(data);
				};
				reader.readAsArrayBuffer(fileUpload.files[0]);
			}
		} else {
			alert("This browser does not support HTML5.");
		}
	} else {
		alert("Please upload a valid Excel file.");
	}
};

function getTableFromExcel(data) {
	// Read the Excel File data in binary
	var workbook = XLSX.read(data, {
		type: 'binary'
	});

	if (workbook.SheetNames.length < 1) {
		alert("No sheets found in spreadsheet.");
		return;
	}

	// Get the name of the First Sheet.
	var sheet = workbook.SheetNames[0];

	// Read all rows from First Sheet into a JSON array.
	var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
	
	if (excelRows.length < 1) {
		alert("No rows in spreadsheet's first sheet (" + sheet + ")");
		return;
	}

	var itemKeys = ['item', 'Item', 'itm', 'Itm', 'itm.', 'Itm.', 'ITEM', 'ITM', 'ITM.'];
	var descKeys = ['description', 'Description', 'desc', 'Desc', 'desc.', 'Desc.', 'DESCRIPTION', 'DESC', 'DESC.'];
	var qtyKeys = ['quantity', 'Quantity', 'qty', 'Qty', 'qty.', 'Qty.', 'QUANTITY', 'QTY', 'QTY.'];
	var itemCol = '';
	var descCol = '';
	var qtyCol = '';
	
	firstRow = excelRows[0];
	for (i in itemKeys) {
		key = itemKeys[i];
		if (key in firstRow) {
			itemCol = key;
			break;
		}
	}
	for (i in descKeys) {
		key = descKeys[i];
		if (key in firstRow) {
			descCol = key;
			break;
		}
	}
	for (i in qtyKeys) {
		key = qtyKeys[i];
		if (key in firstRow) {
			qtyCol = key;
			break;
		}
	}
	if (itemCol === '') {
		alert('No column found named "Item"');
		return;
	}
	if (qtyCol === '') {
		alert('No column found named "Quantity"');
		return;
	}
	
	var table = document.getElementById("items_table");
	var numRows = Math.max(table.rows.length-1, 0);
	addRows(excelRows.length - numRows);
	for (var i = 0; i < excelRows.length; i++) {
		var rowXLS = excelRows[i];
		var id = 'item' + i;
		
		if (itemCol in rowXLS) {
			document.getElementById(id + '_item').value = rowXLS[itemCol];
		}
		if (descCol in rowXLS) {
			document.getElementById(id + '_desc').value = rowXLS[descCol];
		}
		if (qtyCol in rowXLS) {
			document.getElementById(id + '_qty').value = rowXLS[qtyCol];
		}
	}
};
