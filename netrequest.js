function getTAndG_ser(customFunc = () => { }) {
	let data_out;
	let prm = {
		url: 'http://services.niu.ranepa.ru/API/public/teacher/teachersAndGroupsList',
		type: 'GET',
	}
	fetch(SERVICE_URL,{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(prm)

	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			//console.log(data);
			DATA_GROUP_TEACH = data;
			customFunc();
		})
		.catch(error => {
			console.error('There was a problem with the fetch operation:', error);
		});
	return data_out;
}


function getTAndG_nser(customFunc = () => { }) {
	let data_out;
	fetch('http://services.niu.ranepa.ru/API/public/teacher/teachersAndGroupsList')
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			//console.log(data);
			DATA_GROUP_TEACH = data;
			customFunc();
		})
		.catch(error => {
			console.error('There was a problem with the fetch operation:', error);
		});
	return data_out;
}




function getSchedule_ser(group_id, group_type, date_b, date_e, customFunc = () => { }, filt_col='', filt='') {
	// group_type == 0 -> group
	// group_type == 1 -> teacher

	let prm = {
		url: '',
		type: 'POST',
		id: group_id,
		dateBegin: date_b,
		dateEnd: date_e
	};

	// let customPrivatFunc = () => {};
	let flag_supplement = false;
	let local_res = search_in_local_db(group_id, date_b, date_e);
	/*
	local_res = [
		[{}, {}],
		[DateBegin, DateEnd] // Диапазон нехватки данных
	]
	
	*/


	if (local_res[0].length > 0) {
		DATA_SCHEDULE = local_res[0];
		customFunc(group_type, filt_col, filt);
		flag_supplement = true;

		prm.dateBegin = local_res[1][0];
		prm.dateEnd = local_res[1][1];

		// customPrivatFunc = ;

	}

	if (prm.dateBegin == null || prm.dateEnd == null) {
		return;
	}


	if (Boolean(Number(group_type))) {
		prm.url = 'http://services.niu.ranepa.ru/API/public/teacher/getSchedule';
		fetch(SERVICE_URL, {
			method: 'POST',
			type: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(prm)

		}).then(response => {

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();

		}).then(data => {
			if (flag_supplement) {
				add_data_in_local_db(group_id, data);
				DATA_SCHEDULE = DATA_SCHEDULE.concat(data);
			} else {
				DATA_SCHEDULE = data;
				add_data_in_local_db(group_id, DATA_SCHEDULE);
			}


			customFunc(group_type, filt_col, filt);

		}).catch(error => {

			console.error('There was a problem with the fetch operation:', error);

		});

	} else {
		prm.url = 'http://services.niu.ranepa.ru/API/public/group/getSchedule';
		fetch(SERVICE_URL, {
			method: 'POST',
			type: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(prm)

		}).then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		}).then(data => {
			if (flag_supplement) {
				add_data_in_local_db(group_id, data);
				DATA_SCHEDULE = DATA_SCHEDULE.concat(data);
			} else {
				DATA_SCHEDULE = data;
				add_data_in_local_db(group_id, DATA_SCHEDULE);
			}
			customFunc(group_type, filt_col, filt);

		}).catch(error => {
			console.error('There was a problem with the fetch operation:', error);
		});

	}

}



function getSchedule_nser(group_id, group_type, date_b, date_e, customFunc = () => { }, filt_col='', filt='') {
	// group_type == 0 -> group
	// group_type == 1 -> teacher

	let prm = {
		id: group_id,
		dateBegin: date_b,
		dateEnd: date_e
	};

	// let customPrivatFunc = () => {};
	let flag_supplement = false;
	let local_res = search_in_local_db(group_id, date_b, date_e);
	/*
	local_res = [
		[{}, {}],
		[DateBegin, DateEnd] // Диапазон нехватки данных
	]
	
	*/


	if (local_res[0].length > 0) {
		DATA_SCHEDULE = local_res[0];
		customFunc(group_type, filt_col, filt);
		flag_supplement = true;

		prm.dateBegin = local_res[1][0];
		prm.dateEnd = local_res[1][1];

		// customPrivatFunc = ;

	}

	if (prm.dateBegin == null || prm.dateEnd == null) {
		return;
	}


	if (Boolean(Number(group_type))) {

		fetch('http://services.niu.ranepa.ru/API/public/teacher/getSchedule', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(prm)

		}).then(response => {

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();

		}).then(data => {
			if (flag_supplement) {
				add_data_in_local_db(group_id, data);
				DATA_SCHEDULE = DATA_SCHEDULE.concat(data);
			} else {
				DATA_SCHEDULE = data;
				add_data_in_local_db(group_id, DATA_SCHEDULE);
			}


			customFunc(group_type, filt_col, filt);

		}).catch(error => {

			console.error('There was a problem with the fetch operation:', error);

		});

	} else {

		fetch('http://services.niu.ranepa.ru/API/public/group/getSchedule', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(prm)

		}).then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		}).then(data => {
			if (flag_supplement) {
				add_data_in_local_db(group_id, data);
				DATA_SCHEDULE = DATA_SCHEDULE.concat(data);
			} else {
				DATA_SCHEDULE = data;
				add_data_in_local_db(group_id, DATA_SCHEDULE);
			}
			customFunc(group_type, filt_col, filt);

		}).catch(error => {
			console.error('There was a problem with the fetch operation:', error);
		});

	}

}