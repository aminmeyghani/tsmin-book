var path = require('path');
var exec = require('child_process').exec;
var execFile = require('child_process').execFile;
var mdFolder = process.argv[2]; /* folder containing all the html files files */
var fs = require('fs-extra');

/* read output/file.html not output/file-conten.html and run the pdf for each */
execFile('find', [ 'output' ], function(err, stdout, stderr) {
  var fileList = stdout.split('\n');
  var htmlfiles = fileList.filter(function (file) {
    var filename = file.split('/').pop();
    // does not start with `.`, does not content `-content` and ends with `.html`
    return /^[^.](?!.*-content)\w+\.html$/igm.test(filename);
  })
  .map(function (file) {return path.resolve(file) });
  console.log('Converting: ', htmlfiles);
  htmlfiles.forEach(function (htmlInput) {
    var filename = htmlInput.split('/').pop().replace('.html', '.pdf');
    var makePdf = 'phantomjs bin/render.js ' + htmlInput + ' ' + path.join('output/pdf', filename) ;
    exec(makePdf, function(pdfErr, stdout, stderr) {
      if (pdfErr) { return console.log(pdfErr);}
    });
  });
});