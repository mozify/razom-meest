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

}

function printPreview() {
  if (formData === null) {
	  console.log('Form has not been submitted');
	  return;
  }
  
  var orgName = formData.get('entry.259986036');
  var fromAddress = formData.get('entry.936724078');
  var phoneNum = formData.get('entry.517398335');
  var fromInfo = document.getElementById("frominfo");
  fromInfo.innerHTML = '<p class="c12"><span class="c22">From:</span></p>' +
    '<p class="c12"><span class="c2">' + orgName + '</span></p>' +
	'<p class="c12"><span class="c2">' + fromAddress + '</span></p>' +
	'<p class="c12"><span class="c2">Phone: ' + phoneNum + '</span></p>';
  
  var items = [{},
	{"item": "1203673480", "desc": "956988677", "qty": "522580926"},
	{"item": "533622491", "desc": "2080648019", "qty": "2030354322"},
	{"item": "1529758863", "desc": "737069193", "qty": "1536328207"},
	{"item": "1582017420", "desc": "1280869232", "qty": "1685269097"},
	{"item": "950398701", "desc": "2068461472", "qty": "1656239622"},
	{"item": "450073024", "desc": "180910187", "qty": "1594062988"},
	{"item": "415831402", "desc": "1832250409", "qty": "1714125600"},
	{"item": "2023926259", "desc": "2030122625", "qty": "1935368219"},
	{"item": "1538189518", "desc": "1576882950", "qty": "1542615339"},
	{"item": "1935504802", "desc": "358200408", "qty": "761419820"},
	{"item": "1831162031", "desc": "160586822", "qty": "1567182632"},
	{"item": "1068857030", "desc": "2012965415", "qty": "640376010"},
	{"item": "2050570982", "desc": "2139712861", "qty": "105555528"},
	{"item": "867356230", "desc": "1025266810", "qty": "710478666"},
	{"item": "686974161", "desc": "490165234", "qty": "1402370900"},
  ];
  
  for (let i = 1; i < items.length; i++) {
	var item = formData.get('entry.' + items[i].item);
	var desc = formData.get('entry.' + items[i].desc);
	var qty = formData.get('entry.' + items[i].qty);
	var row = document.getElementById("item" + i);
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
    
  document.getElementById("submit_button").style.display = "none";
}
