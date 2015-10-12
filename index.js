!function () {
    'use strict';

    let char = [0, 1, 2, 3].map(c => String.fromCharCode(c)),
        re = Object.assign([0, 1, 2, 3].map(c => new RegExp(char[c], 'gm')), {
            n: /\n/gm,
            slash: /\\/gm,
            quote: /'/gm
        });

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = justjst;
    } else if (typeof modules === 'object') {
        modules.define('justjst', provide => provide(justjst));
    } else if (typeof define === 'function') {
        define((require, exports, module) => module.exports = justjst);
    } else {
        window.justjst = justjst;
    }

    function justjst (template) {
        for (let c = 0, cl = char.length; c < cl; c++) {
            template = template.replace(re[c], '');
        }
        let jsInserts = [],
            templateCode = (template + '')
                .replace(re.n, char[0])
                .replace(re.slash, char[2])
                .replace(/<\?(.*?)[^\\]\?>/gm, (match, group) => {
                    group = group
                        .replace(re[0], '\n')
                        .replace(re[2], '\\')
                        .replace(re.slash, '\\\\');
                    jsInserts.push(group[0] === '=' ? `echo(${group.slice(1)})` : group);
                    return char[3];
                })
                .split(char[3])
                .map((string, s) => {
                    return `jst+='${string.replace(/\'/gm,char[1])}';\n${jsInserts[s]||''};\n`;
                })
                .join('')
                .replace(re.quote, '\\\'')
                .replace(re.n, '\\n'),
            body = `
                'use strict';
                data = data || {};
                let args = Object.keys(data),
                    body = '"use strict";' +
                        'let echo=(something)=>{jst+=something;return "";};' +
                        'let re=[0,1,2].map(c=>new RegExp(String.fromCharCode(c),"gm"));' +
                        'let jst="";' +
                        '${templateCode}' +
                        'return jst.replace(re[0],"\\\\n").replace(re[1],"\\\'").replace(re[2],"\\\\\\\\");',
                    fn = new Function(args.join(','), body);
                return fn.apply(fn, args.map(key => data[key]));
            `,
            fn = new Function('data', body);
        return fn;
    };
}();
