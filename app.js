// Globals values
let DATA_GROUP_TEACH = [], DATA_SCHEDULE = [];


function getTAndG() {};

function getSchedule () {};




function formatDate(changeDay = 0, changeMonth = 0, changeYear = 0) {
	const date = new Date();

	date.setDate(date.getDate() + changeDay);
	date.setMonth(date.getMonth() + changeMonth);
	date.setFullYear(date.getFullYear() + changeYear);

	const formattedDay = String(date.getDate()).padStart(2, '0');
	const formattedMonth = String(date.getMonth() + 1).padStart(2, '0');
	const formattedYear = date.getFullYear();

	return `${formattedDay}.${formattedMonth}.${formattedYear}`;
}




function dateDifference(dateStr1, dateStr2) {
	function parseDate(dateStr) {
		const [day, month, year] = dateStr.split('.').map(Number);
		return new Date(year, month - 1, day);
	}

	const date1 = parseDate(dateStr1);
	const date2 = parseDate(dateStr2);
	const differenceInTime = Math.abs(date2 - date1);

	return Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
}




function getDateHumanType(dateString) {
	const date = new Date(dateString);
	const months = ["янв.", "фев.", "мар.", "апр.", "май", "июн.", "июл.", "авг.", "сен.", "окт.", "ноя.", "дек."];
	const day = date.getDate();
	const month = months[date.getMonth()];
	const weekdays = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
	const weekday = weekdays[date.getDay()];
	return [`${day} ${month}`, weekday];
}




function calcMatchWord(str, substring) {
	const lowerStr = str.toLowerCase();
	const lowerSubstring = substring.toLowerCase();

	for (let i = 1; i <= lowerSubstring.length; i++) {
		if (!lowerStr.includes(lowerSubstring.slice(0, i))) {
			return (i - 1) * 100 / lowerSubstring.length// * (lowerSubstring.length / lowerStr.length);
		}
	}

	return 100// * (lowerSubstring.length / lowerStr.length);
}




function max(arr) {
	if (arr.length === 0) {
		return undefined;
	}

	let maxElement = arr[0];

	for (let i = 1; i < arr.length; i++) {
		if (arr[i] > maxElement) {
			maxElement = arr[i];
		}
	}

	return maxElement;
}




function scoreMatch(str, substring) {
	let arr_words_str = str.split(' ');
	let arr_words_sub = substring.trim().split(' ');
	let all_match = [];

	arr_words_str.forEach(w => {
		arr_words_sub.forEach(w_sub => {
			all_match.push(calcMatchWord(w, w_sub));
		});
	});
	// all_match /= arr_words_str.length;
	return max(all_match);
}




function sortObjectEntries(obj) {
    const entries = Object.entries(obj).flatMap(([key, [name, score]]) => {
        return [[name, key]];
    });

    // sort by score regress
    entries.sort((a, b) => {
        const scoreA = obj[a[1]][1];
        const scoreB = obj[b[1]][1];
        return scoreB - scoreA;
    });

    return entries;
}




function getPairNumber(startTime, endTime) {
	// Определяем стандартное время пар
	const pairs = {
		1: { start: "08:00", end: "09:30" },
		2: { start: "09:40", end: "11:10" },
		3: { start: "11:20", end: "12:50" },
		4: { start: "13:20", end: "14:50" },
		5: { start: "15:00", end: "16:30" },
	};

	// Проверяем каждую пару
	for (const [pairNumber, times] of Object.entries(pairs)) {
		if (times.start === startTime && times.end === endTime) {
			return pairNumber;
		}
	}
	return startTime;
}

function getLessonType(str) {
	let st = str.split(' ');
	if (st.length > 1) {
		return st[0].slice(0, -1) + '.';
	} else {
		return str + '.';
	}
}




function checkTheme() {
	const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
	if (isDarkMode) {
		console.log('Пользователь использует темную тему.');
	} else {
		console.log('Пользователь использует светлую тему.');
	}
}


// Примеры использования функции
// console.log(formatDate()); // Текущая дата
// console.log(formatDate(-1)); // Уменьшаем на 1 день
// console.log(formatDate(0, 0, 1)); // Увеличиваем на 1 год
// console.log(formatDate(0, 1)); // Увеличиваем на 1 месяц

//const user = { name: 'John', age: 30 };
//localStorage.setItem('user', JSON.stringify(user));

//const retrievedUser = JSON.parse(localStorage.getItem('user'));
//console.log(retrievedUser.name); // 'John'
