
function saveData_GT() {
	for (let i = 0; i < DATA_GROUP_TEACH.length; i++) {
		DATA_GROUP_TEACH[i].next_node = `gt${i + 1}`;
		localStorage.setItem(`gt${i}`, JSON.stringify(DATA_GROUP_TEACH[i]));
	}
	DATA_GROUP_TEACH[DATA_GROUP_TEACH.length - 1].next_node = null;
	localStorage.setItem(`gt${DATA_GROUP_TEACH.length - 1}`, JSON.stringify(DATA_GROUP_TEACH[DATA_GROUP_TEACH.length - 1]));

	localStorage.setItem('gt_m', JSON.stringify({
		date: formatDate()
	}));
}



// time of relevance TOR
function loadData_GT() {
	if (JSON.parse(localStorage.getItem('gt0')) != null) { // && dateDifference(JSON.parse(localStorage.getItem('gt_tor')).date, formatDate()) < 10
		let n_Node = 'gt0';
		while (n_Node != null) {
			DATA_GROUP_TEACH.push(JSON.parse(localStorage.getItem(n_Node)));
			n_Node = DATA_GROUP_TEACH[DATA_GROUP_TEACH.length - 1].next_node;
		}
	} else {
		getTAndG(saveData_GT);
	}
}



function make_fast_start(input_val, oid, type, filt_col, filt) {
	localStorage.setItem('fast_start', JSON.stringify({
		in0: input_val,
		oid: oid,
		type: type,
		filt_col: filt_col,
		filt: filt,
	}));
}




function getImprint(obj, keyIgnore = ['imprint', 'date_set']) {

	function simpleHash(str) {
		let hash = 5381;
		for (let i = 0; i < str.length; i++) {
			hash = (hash * 33) ^ str.charCodeAt(i);
		}
		return hash >>> 0;
	}

	let str_out = '';
	Object.entries(obj).forEach(([key, value]) => {
		if (!keyIgnore.some(el => el === key)) { //key !== keyIgnore
			str_out += value;
		}
	});
	return String(simpleHash(str_out));
}


// collisions test
/*function testGetImprint(objects, keyIgnore = ['imprint', 'date_set']) {
	const imprintMap = new Map();
	for (const obj of objects) {
		const imprint = getImprint(obj, keyIgnore);
		if (imprintMap.has(imprint)) {
			console.log(`Collision detected! Imprint: ${imprint}`);
			console.log(`Objects:`, imprintMap.get(imprint), obj);
			return true;
		}
		imprintMap.set(imprint, obj);
	}
	console.log('No collisions detected.');
	return false;
}*/




function add_data_in_local_db(label, arr_obj) {
	// label contains oid
	let data_in_storage = JSON.parse(localStorage.getItem('DATA_SCHEDULE_ALL'));
	if (data_in_storage == null) {
		data_in_storage = [];
	}
	for (let i = 0; i < arr_obj.length; i++) {
		arr_obj[i].label = label;
		let imprint_obj = getImprint(arr_obj[i]);
		let flag_collision = data_in_storage.some(objj => objj['imprint'] === imprint_obj);
		if (!flag_collision) {
			arr_obj[i].imprint = imprint_obj;
			arr_obj[i].date_set = formatDate();
			data_in_storage.push(arr_obj[i]);
		}
	}
	localStorage.setItem('DATA_SCHEDULE_ALL', JSON.stringify(data_in_storage));
}


function search_in_local_db(oid, date_b, date_e) {
	let data_in_storage = JSON.parse(localStorage.getItem('DATA_SCHEDULE_ALL'));
	if (data_in_storage == null) {
		data_in_storage = [];
	}
	function parseDate(dateString) {
		const [day, month, year] = dateString.split('.').map(Number);
		return new Date(year, month - 1, day);
	}
	function frmtDt(date) {
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
		const year = date.getFullYear();
		return `${day}.${month}.${year}`;
	}

	const startDate = parseDate(date_b);
	const endDate = parseDate(date_e);

	const filteredAndSortedData = data_in_storage
		.filter(item => {
			const itemDate = new Date(item.xdt);
			return item.xdt !== "" && item.label === oid && itemDate >= startDate && itemDate <= endDate;
		})
		.sort((a, b) => new Date(a.xdt) - new Date(b.xdt));



	// Determine the minimum and maximum date from the filtered data
	let minFoundDate = null;
	let maxFoundDate = null;

	if (filteredAndSortedData.length > 0) {
		minFoundDate = new Date(filteredAndSortedData[0].xdt);
		maxFoundDate = new Date(filteredAndSortedData[filteredAndSortedData.length - 1].xdt);
	}


	let gapStart = null;
	let gapEnd = null;

	if (minFoundDate && maxFoundDate) {
		// Check if there are gaps before and after the dates found
		if (minFoundDate > startDate) {
			gapStart = startDate; // Пробел начинается с начала входящего диапазона
			gapEnd = new Date(minFoundDate.getTime() - 24 * 60 * 60 * 1000); // Конец пробела - день перед минимальной найденной датой
		}
		if (maxFoundDate < endDate) {
			if (!gapStart) {
				gapStart = new Date(maxFoundDate.getTime() + 24 * 60 * 60 * 1000); // Начало пробела - день после максимальной найденной даты
			}
			gapEnd = endDate; // Пробел заканчивается на конце входящего диапазона
		}
	}


	const formattedGapStart = gapStart ? frmtDt(gapStart) : null;
	const formattedGapEnd = gapEnd ? frmtDt(gapEnd) : null;

	return [filteredAndSortedData, [formattedGapStart, formattedGapEnd]];
}

function garbage_collector() { }

