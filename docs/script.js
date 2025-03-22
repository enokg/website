var gData;
var url =  'https://script.google.com/macros/s/AKfycbxHQZD3D_H8Z429IUJGeg1yUbAoQ_7N6vqbwkt7Hbfjbh_6AaJ-qe0buzEzleZ0o7w4mA/exec' 

  function getDataAPI() 
  {  
    $('#d_table').html('<div class="col">Please Wait.....</div>') 
    const url1 = url+'?action=getAllData'   
   
    fetch(url1)
    .then(response =>{      
      return response.json()        
    })
    .then(data => {
      gData = data.data
      showSendPatientTable(gData)
      console.log(data.data);
      
    })
    .catch(error => {
      console.error("Error in fetch:", error.message);
      
    });
  }
	/**
	 * Prevent forms from submitting.
	 * */

	function preventFormSubmit() {
		var forms = document.querySelectorAll('form');
		for (var i = 0; i < forms.length; i++) {
			forms[i].addEventListener('submit', function (event) {
				event.preventDefault();
			});
		}
	}

	window.addEventListener("load", functionInit, true);
	window.addEventListener("beforeunload", falseState, true);

	/**
	 * INITIALIZE FUNCTIONS ONLOAD
	 * */

	function functionInit() {
		$('#spinnerModal').modal('show');
		preventFormSubmit();
		getAllData();
		createKotaDropdown();
		createGenderDropdown();
	};


	/**
	 * HANDLE FORM SUBMISSION
	 * */

	function handleFormSubmit(formObject) {
		$('#spinnerModal').modal('show');
		google.script.run.withSuccessHandler(createTable).processForm(formObject);
		setTimeout(function () {
			$('#myModal').modal('hide');
		}, 2000);
		document.getElementById("message").innerHTML = "<div class='alert alert-warning' role='alert'>Data berhasil ditambahkan!.</div>";
		document.getElementById("myForm").reset();
		var oTable = $('#dataTable').dataTable();
		// Hide/show the column after initialisation
		oTable.fnSetColumnVis(0, false);
	}


	function refreshApp(newHtml) {
		$('#spinnerModal').modal('show');
		falseState();
		document.open();
		document.write(newHtml);
		document.close();
		$('#myModal').modal('hide');
	}

	function falseState() {
		var dtTable = $('#dataTable').DataTable();
		dtTable.state.clear();//Clear State
		dtTable.destroy();//Destroy
	}

	/**
	 * Clear form when pop-up is closed.  
	 * */

	function clearForm() {
		document.getElementById("message").innerHTML = "";
		document.getElementById("myForm").reset();
	}


	/**
	 * GET ALL DATA
	 * */

	function getAllData() {
		//$('#spinnerModal').modal('show');
		//document.getElementById('dataTable').innerHTML = "";
		google.script.run.withSuccessHandler(createTable).getAllData();
	}

	/**
	 * CREATE THE DATA TABLE
	 * */

	/**
	 * class='table table-sm'
	 * */

	/**
	* class='w3-table-al'
	* */
	function createTable(dataArray) {
		$('#spinnerModal').modal('hide');
		if (dataArray) {
			var result = "<div>" +
				"<table class='w3-table-all' style='font-size:1em'>" +
				"<thead class='couleur' style='white-space: nowrap'>" + //style='white-space: nowrap'
				"<tr>" +
				//Change table headings to match witht he Google Sheet                            
				"<th scope='col'>ID</th>" +
				"<th scope='col'>Nom & Prénom (s)</th>" +
				"<th scope='col'>Adresse email</th>" +
				"<th scope='col'>Téléphone</th>" +
				"<th scope='col'>Genre</th>" +
				"<th scope='col'>Date de naissance</th>" +
				"<th scope='col'>Pays</th>" +
				"<th scope='col'>Dernière modification</th>" +
				"<th scope='col'></th>" +
				"<th scope='col'></th>" +
				"</tr>" +
				"</thead>";
			result += "<tbody class='corp'>"
			for (var i = 0; i < dataArray.length; i++) {

				result += "<tr>";

				for (var j = 0; j < dataArray[i].length; j++) {
					result += "<td>" + dataArray[i][j] + "</td>";
				}
				result += "<td><i class='fa fa-duotone fa-pen-to-square modif' data-bs-toggle='modal' data-bs-target='#myModal' onclick='editData(this);'></td>";
				result += "<td><i class='fa fa-sharp fa-solid fa-trash sup' onclick='deleteData(this);'></td>";
				result += "</tr>";
			}
			result += "</tbody>";

			result += "</table></div>";
			var div = document.getElementById('dataTable');
			div.innerHTML = result;
			$(document).ready(function () {
				$('#dataTable').DataTable({
					destroy: true,
					responsive: true,
					select: true,
					stateSave: true,
					ordering: true,
					order: [[0, 'desc']],
					pageLength: 10,
					lengthMenu: [
						[10, 25, 50, 100, -1],
						['10', '25', '50', '100', 'All']
					],
					columnDefs: [{
						targets: [1, 8, 9],
						className: 'all',
					},
					{
						targets: [0],
						visible: false, //hide kolom pertama/0
						searchable: true,
					},
					{
						targets: [3],
						className: 'dt-body-center',
						"render": function (data, type, row, meta) {
							if (type === 'display' && data.length > 5) {
								data = '<a href="https://wa.me/62' + data + '?text=' + row[3] + '" target="_blank">' + '<i class="fa-brands fa-whatsapp" style="font-size:20px;color:green"></i>' + '</a>';
							}
							return data;
						}
					},
					]
				});
			});
		}
	}


	/**
	 * DELETE DATA
	 * */

	function deleteData(el) {
		var oTable = $('#dataTable').dataTable();
		// Hide the second column after initialisation
		oTable.fnSetColumnVis(0, true);
		Swal.fire({
			title: 'Voulez-vous vraiment confirmer la suppression?',
			icon: 'warning',
			html: `<input type="password" id="password" class="swal2-input" placeholder="Saisir votre mot de passe">`,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			cancelButtonText: 'Annuler',
			confirmButtonText: 'Confirmer!',
			allowOutsideClick: false,
			preConfirm: () => {
				var pass = "123";
				var password = Swal.getPopup().querySelector('#password').value
				if (password == pass) {
					var recordId = el.parentNode.parentNode.cells[0].innerHTML;
					google.script.run.withSuccessHandler(createTable).deleteData(recordId);
					oTable.fnSetColumnVis(0, false);
				} else {
					Swal.showValidationMessage('Mot de passe incorrect')
				}
			},
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire(
					'Suppression !',
					'Le fichier a été supprimé avec succès !',
					'success',
				)
			} else {
				Swal.fire(
					'Annulation !',
					'La suppression a été annulée :)',
					'error',
				)
				oTable.fnSetColumnVis(0, false);
			}
		});
	}


	//FOR POPULATE FORM------------------------------------------------------------------------------------------------------

	//RETRIVE DATA FROM GOOGLE SHEET FOR KOTA DROPDOWN
	function createKotaDropdown() {
		//SUBMIT YOUR DATA RANGE FOR DROPDOWN AS THE PARAMETER
		google.script.run.withSuccessHandler(kotaDropDown).getDropdownListKota("Kota!A1:A");
	}

	//POPULATE KOTA DROPDOWNS
	function kotaDropDown(values) { //Ref: https://stackoverflow.com/a/53771955/2391195
		var list = document.getElementById('kota');
		for (var i = 0; i < values.length; i++) {
			var option = document.createElement("option");
			option.value = values[i];
			option.text = values[i];
			list.appendChild(option);
		}
	}

	//RETRIVE DATA FROM GOOGLE SHEET FOR KOTA DROPDOWN
	function createGenderDropdown() {
		//SUBMIT YOUR DATA RANGE FOR DROPDOWN AS THE PARAMETER
		google.script.run.withSuccessHandler(genderDropDown).getDropdownListKota("Genre!A1:A");
	}

	//POPULATE gender DROPDOWNS
	function genderDropDown(values) { //Ref: https://stackoverflow.com/a/53771955/2391195
		var list = document.getElementById('gender');
		for (var i = 0; i < values.length; i++) {
			var option = document.createElement("option");
			option.value = values[i];
			option.text = values[i];
			list.appendChild(option);
		}
	}

	/** 
	 * EDIT DATA
	 * https://stackoverflow.com/a/32377357/2391195
	 * */

	function editData(el) {
		var oTable = $('#dataTable').dataTable();
		// // Hide/show the column after initialisation
		oTable.fnSetColumnVis(0, true);
		var recordId = el.parentNode.parentNode.cells[0].innerHTML;
		google.script.run.withSuccessHandler(populateForm).getRecordById(recordId);
	}

	/** 
	 * POPULATE FORM
	 * */

	function populateForm(records) {
		document.getElementById('RecId').value = records[0][0];
		document.getElementById('nama').value = records[0][1];
		document.getElementById('email').value = records[0][2];
		document.getElementById('telp').value = records[0][3];
		document.getElementById('gender').value = records[0][4];
		document.getElementById('tglLahir').value = records[0][5];
		document.getElementById('kota').value = records[0][6];
		document.getElementById("message").innerHTML = "<div class='alert alert-warning' role='alert'>Modifier [ID: " + records[0][0] + "]</div>";
	}


