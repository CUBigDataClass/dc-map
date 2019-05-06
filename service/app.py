from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return jsonify({'msg':'Welcome to the Spark clustering API Library'})

@app.route('/get_clusters/<string:date_hour>', methods=['GET'])
def get_clusters(date_hour):
    return jsonify({'date_hour': date_hour})

if __name__ == '__main__':
    app.run(debug=True)