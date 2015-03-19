from flask import Flask

app = Flask(__name__)


@app.route('/log/<path:message>')
def	log(message=None):
		f = open('../../../log.txt', 'a')
		f.write(message+'\n')
		return "{'success'='true'}"



if __name__ == '__main__':
	app.debug = True
	app.run()
		
