function input_processing(text, enter_flag = false) {
	// console.log(text);

	let arr_multi_sort = text.split('@');
	arr_multi_sort = arr_multi_sort.map(item => item.trim());
	// console.log(arr_multi_sort);


	let arr_rating = [];
	for (let i = 0; i < DATA_GROUP_TEACH.length; i++) {
		arr_rating.push({
			oid: DATA_GROUP_TEACH[i].oid,
			type: DATA_GROUP_TEACH[i].type,
			value_proc: scoreMatch(DATA_GROUP_TEACH[i].value, arr_multi_sort[0]), // value_proc: scoreMatch(DATA_GROUP_TEACH[i].value, text),
			value_text: DATA_GROUP_TEACH[i].value
		});
	}
	arr_rating.sort((a, b) => b.value_proc - a.value_proc);
	if (arr_rating.length > 10) {
		// console.log(arr_rating.slice(0, 6));
		arr_rating = arr_rating.slice(0, 10);
	}


	/*
		d_rating_group = {
			'13:20': ['nf', <score>],
			'СО 203а': ['number', <score>],
		};

		arr_rating_group = [
			['nf', '13:20'],		// score 2 e.
			['number', 'СО 203а']	// score 1 e.
		];

	*/

	let d_rating_group = {};
	let arr_rating_group = [];

	if (arr_multi_sort.length > 1) {


		let res = search_in_local_db(arr_rating[0].oid, formatDate(), formatDate(LOADING_RANGE))[0];
		if (res.length > 0) {
			for (let i = 0; i < res.length; i++) {
				for (let j = 0; j < SEARCH_LIMIT.length; j++) {
					if (res[i][SEARCH_LIMIT[j]] !== undefined) {
						if (d_rating_group[res[i][SEARCH_LIMIT[j]]] === undefined) {
							d_rating_group[res[i][SEARCH_LIMIT[j]]] = [SEARCH_LIMIT[j], scoreMatch(res[i][SEARCH_LIMIT[j]], arr_multi_sort[1])];
						}
					}
				}
			}
		}

		// print(d_rating_group);
		arr_rating_group = sortObjectEntries(d_rating_group);
		if (arr_rating_group.length > 10) {
			arr_rating_group = arr_rating_group.slice(0, 10);
		}


	}



	if (enter_flag) {
		if (arr_multi_sort.length > 1) {
			document.getElementById('in0').value = arr_rating[0].value_text + '@' + arr_rating_group[0][1];
			setChoice(arr_rating[0].oid, arr_rating[0].type, arr_rating_group[0][0], arr_rating_group[0][1]);
		} else {
			document.getElementById('in0').value = arr_rating[0].value_text;
			setChoice(arr_rating[0].oid, arr_rating[0].type);
		}
		


	} else {
		if (isExpanded) {

			if (arr_multi_sort.length > 1) {
				const suggestions = document.querySelectorAll('.search-block');
				suggestions.forEach(suggestion => {
					suggestion.remove();
				});
				// console.log(arr_rating)
				const searchSection = document.getElementById('search-section');

				for (let i = 0; i < arr_rating_group.length; i++) {
					const suggestions = document.createElement('div');
					suggestions.classList.add('search-block');
					suggestions.id = arr_rating[0].oid;
					suggestions.setAttribute('name', arr_rating[0].value_text);
					suggestions.setAttribute('type', arr_rating[0].type);
					suggestions.setAttribute('filt_col', arr_rating_group[i][0]);
					suggestions.setAttribute('filt', arr_rating_group[i][1]);
					suggestions.addEventListener('click', function () {
						document.getElementById('in0').value = this.getAttribute('name') + '@' + this.getAttribute('filt');
						setChoice(this.id, this.getAttribute('type'), this.getAttribute('filt_col'), this.getAttribute('filt'));
					});
					suggestions.innerHTML = `<span>${arr_rating[0].value_text}@${arr_rating_group[i][1]}</span>`;
					searchSection.append(suggestions);
				}
			} else {
				// Удаляем блок с подсказками
				const suggestions = document.querySelectorAll('.search-block');
				suggestions.forEach(suggestion => {
					suggestion.remove();
				});
				// console.log(arr_rating)
				const searchSection = document.getElementById('search-section');

				for (let i = 0; i < arr_rating.length; i++) {
					const suggestions = document.createElement('div');
					suggestions.classList.add('search-block');
					suggestions.id = arr_rating[i].oid;
					suggestions.setAttribute('name', arr_rating[i].value_text);
					suggestions.setAttribute('type', arr_rating[i].type);
					suggestions.setAttribute('filt_col', '');
					suggestions.setAttribute('filt', '');
					suggestions.addEventListener('click', function () {
						document.getElementById('in0').value = this.getAttribute('name');
						setChoice(this.id, this.getAttribute('type'));
					});
					suggestions.innerHTML = `<span>${arr_rating[i].value_text}</span>`;
					searchSection.append(suggestions);
				}

			}

		}

	}

}




function render_blocks() {
	// Удаляем блок с подсказками
	const suggestions = document.querySelectorAll('.info-block');
	suggestions.forEach(suggestion => {
		suggestion.remove();
	});


	const searchSection = document.getElementById('info-list');
	let last_date = '';
	for (let i = 0; i < DATA_SCHEDULE.length; i++) {
		if (DATA_SCHEDULE[i].xdt != last_date) {
			last_date = DATA_SCHEDULE[i].xdt;
			const suggestions = document.createElement('div');
			suggestions.classList.add('info-block');
			suggestions.innerHTML = `<span>${getDateHumanType(DATA_SCHEDULE[i].xdt)[0]}</span>`;
			searchSection.append(suggestions);

		}
		const suggestions = document.createElement('div');
		suggestions.classList.add('info-block');
		// suggestions.id = DATA_SCHEDULE[i].oid;
		// suggestions.setAttribute('name', DATA_SCHEDULE[i].value_text);
		// suggestions.addEventListener('click', function () {
		// 	document.getElementById('in0').value = this.getAttribute('name');
		// 	setChoice(this.id);
		// });
		suggestions.innerHTML = `<span>${DATA_SCHEDULE[i].subject}</span>`;
		searchSection.append(suggestions);

	}

}


function render_blocks_n(type_card, filt_col = '', filt = '') {
	// Удаляем блок с подсказками
	const suggestions = document.querySelectorAll('.info-card');
	suggestions.forEach(suggestion => {
		suggestion.remove();
	});



	function getMissingDays(startDateStr, endDateStr) {
		const startDate = new Date(startDateStr);
		const endDate = new Date(endDateStr);
		const missingDays = [];

		let currentDate = new Date(startDate);
		currentDate.setDate(currentDate.getDate() + 1);

		while (currentDate < endDate) {

			const year = currentDate.getFullYear();
			const month = String(currentDate.getMonth() + 1).padStart(2, '0');
			const day = String(currentDate.getDate()).padStart(2, '0');
			const formattedDate = `${year}-${month}-${day} 00:00:00.000`;
			missingDays.push(formattedDate);
			// Переходим к следующему дню
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return missingDays;
	}



	let card, date;


	function create_clear_card(arr) {
		for (let i = 0; i < arr.length; i++) {
			card = document.createElement('div');
			card.classList.add('info-card');

			date = document.createElement('div');
			date.classList.add('info-date-clear');
			let hd = getDateHumanType(arr[i]);
			date.innerHTML = `<span>${hd[0]} ${hd[1]}</span>`;
			card.append(date);

			let info_block_clear = document.createElement('div');
			info_block_clear.classList.add('info-block-clear');
			info_block_clear.innerHTML = '<span>...</span>';
			card.append(info_block_clear);
			searchSection.append(card);

		}

	}


	function create_one_subj(num, teacher, subject, type, class_n) {
		let info_block_n = document.createElement('div');
		info_block_n.classList.add('info-block-n');


		let info_block_ingrid_num = document.createElement('div');
		info_block_ingrid_num.classList.add('info-block-ingrid-num');
		info_block_ingrid_num.innerText = num;
		info_block_n.append(info_block_ingrid_num);


		let info_block_ingrid_t = document.createElement('div');
		info_block_ingrid_t.classList.add('info-block-ingrid-t');
		info_block_ingrid_t.innerText = teacher;
		info_block_n.append(info_block_ingrid_t);


		let info_block_ingrid_s = document.createElement('div');
		info_block_ingrid_s.classList.add('info-block-ingrid-s');
		info_block_ingrid_s.innerText = subject;
		info_block_n.append(info_block_ingrid_s);

		let info_block_ingrid_c = document.createElement('div');
		info_block_ingrid_c.classList.add('info-block-ingrid-c');
		info_block_ingrid_c.innerText = type;
		info_block_n.append(info_block_ingrid_c);

		let info_block_ingrid_w = document.createElement('div');
		info_block_ingrid_w.classList.add('info-block-ingrid-w');
		info_block_ingrid_w.innerText = class_n;
		info_block_n.append(info_block_ingrid_w);

		return info_block_n;
	}

	const searchSection = document.getElementById('info-list');
	let last_date = '';
	for (let i = 0; i < DATA_SCHEDULE.length; i++) {

		

		if (DATA_SCHEDULE[i].xdt != last_date) {

			if (card) {
				searchSection.append(card);
			}

			let msd = getMissingDays(last_date, DATA_SCHEDULE[i].xdt);
			if (msd.length > 0) {
				create_clear_card(msd);
			}



			last_date = DATA_SCHEDULE[i].xdt;


			card = document.createElement('div');
			card.classList.add('info-card');

			date = document.createElement('div');
			date.classList.add('info-date');
			let hd = getDateHumanType(DATA_SCHEDULE[i].xdt);
			date.innerHTML = `<span>${hd[0]} ${hd[1]}</span>`;

			card.append(date);


		}
		
		// console.log(DATA_SCHEDULE[i][filt_col], filt);
		if (DATA_SCHEDULE[i][filt_col] != filt && filt != '' && filt_col != '') {
			continue;
		}
		let num_pair = getPairNumber(DATA_SCHEDULE[i].nf, DATA_SCHEDULE[i].kf);
		let info_block_n;
		if (type_card == 0) {
			info_block_n = create_one_subj(num_pair, DATA_SCHEDULE[i].teacher, DATA_SCHEDULE[i].subject, getLessonType(DATA_SCHEDULE[i].type), DATA_SCHEDULE[i].number);
		} else {
			info_block_n = create_one_subj(num_pair, DATA_SCHEDULE[i].group, DATA_SCHEDULE[i].subject, getLessonType(DATA_SCHEDULE[i].type), DATA_SCHEDULE[i].number);
		}

		card.append(info_block_n);

	}

}