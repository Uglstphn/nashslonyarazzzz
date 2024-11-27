# from flask import Flask, jsonify, request
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# @app.route('/api/data', methods=['POST'])
# def get_data():
#     # Получаем данные из запроса
#     params = request.json
#     # Пример обработки параметров
#     response_data = {
#         "message": "Данные успешно получены!",
#         "received_params": params
#     }
#     return jsonify(response_data)

# if __name__ == '__main__':
#     app.run(debug=True)


# import requests

# url = 'http://services.niu.ranepa.ru/API/public/group/getSchedule'
# data = {
#     'id': '19979',
#     'dateBegin': '09.11.2024',
#     'dateEnd': '25.11.2024'
# }

# # Заголовки
# headers = {
#     'Content-Type': 'application/x-www-form-urlencoded',
#     'Connection': 'Keep-Alive',
#     'Accept-Encoding': 'gzip',
#     'User-Agent': 'okhttp/3.4.1'
# }

# # Выполнение POST-запроса с заголовками
# response = requests.post(url, data=data, headers=headers)

# # Проверка статуса ответа
# if response.status_code == 200:
#     print('Успех:', response.json())  # Если ответ в формате JSON
# else:
#     print('Ошибка:', response.status_code, response.text)




import requests

proxy = {
	'http': '203.142.77.226:8080',
    'https': '203.142.77.226:8080',
}

external_api_url = 'https://google.com/'
response = requests.get(external_api_url, proxies=proxy)
print(response)