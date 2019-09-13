// The following results in 'hello [MANGLED]'
//
// Filed as https://github.com/ry/node/issues/issue/402

const sys = require('sys');


const buf = new Buffer(1024); var len;


const str1 = 'aGVsbG8g';
// 'hello '

const str2 = 'd29ybGQ=';
// 'world'


var len = buf.write(str1, 0, 'base64');

len += buf.write(str2, len, 'base64');
sys.log(`decoded result: ${buf.toString('binary', 0, len)}`);
