# justjst

**DON'T USE THE PACKAGE. IT'S DEPRECATED!!!
USE TEMPLATE STRINGS INSTEAD.**

The easiest template engine to compile javascript templates. The module returns template-function, which could be executed any moment and returns the final string.

Are there some options? No. All you can use is constructions like `<? echo('9 + 16 = 25') ?>` and `<?= 2 * 2 === 4 ?>`.

## Usage example
You may use this module both with Node.js or in the browser.
```javascript
'use strict';
let justjst = require('justjst'),
    template = justjst('Hello, <? echo(name) ?>!\n2 * 2 = <?= x ?>');

console.log(template({
    x: 4,
    name: 'world'
}));

/*
Hello, world!
2 * 2 = 4
*/
```
You may find an example of real use [here](https://github.com/Enet/demo-es2015).
