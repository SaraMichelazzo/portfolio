# run the development server
dev:
	@echo "Start watchify"
	watchify -t coffeeify --extension=".coffee" coffee/index.coffee -o public/js/index.js

build:
	@echo "Create js file"
	browserify -t coffeeify --extension=".coffee" coffee/index.coffee > public/js/index.js
