const { exec } = require('child_process');
const fs = require('fs-extra');
const chalk = require('chalk');

console.log(chalk.bgGreen("--build--"))
console.log(chalk.bgRed("removing bw_static/build"));
fs.remove('bw_static/build', () => {
	console.log(chalk.bgCyan("Building optimized frontend static files to bw_static/build (10 ~ 60sec)"));
	exec('cd bw_static && npm run build', (err, stdout,stderr) => {
	  if (err) {
	    console.error(err);
	    return;
	  }
		console.log(chalk.bgRed("removing bw_api/public"));
	  fs.remove('bw_api/public', () => {
		console.log(chalk.bgYellow("moving bw_static/build to bw_api/public"));
	  	fs.move('bw_static/build', 'bw_api/public', () => {
			console.log(chalk.bgCyan("run babel at bw_api"));
			exec('cd bw_api && npm run build', () => {
				console.log('builded. run : npm run server (cd bw_api && npm run build/server)');
			})
	  	})
	  });
	});
})
